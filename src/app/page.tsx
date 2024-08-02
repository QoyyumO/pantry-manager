'use client'

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Grid, Card, CardContent, 
  CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  AppBar, Toolbar, InputAdornment
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import Auth from '../components/Auth';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  userId: string;
}

export default function Home() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0 });
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchItems(currentUser.uid);
      } else {
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchItems = async (userId: string) => {
    if (!userId) return;
    const q = query(collection(db, 'pantryItems'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const fetchedItems: PantryItem[] = [];
    querySnapshot.forEach((doc) => {
      fetchedItems.push({ id: doc.id, ...doc.data() } as PantryItem);
    });
    setItems(fetchedItems);
  };

  const addItem = async () => {
    if (newItem.name && newItem.quantity > 0 && user) {
      await addDoc(collection(db, 'pantryItems'), { ...newItem, userId: user.uid });
      setNewItem({ name: '', quantity: 0 });
      fetchItems(user.uid);
      setOpenDialog(false);
    }
  };

  const updateItem = async () => {
    if (editItem && editItem.name && editItem.quantity > 0) {
      await updateDoc(doc(db, 'pantryItems', editItem.id), {
        name: editItem.name,
        quantity: editItem.quantity,
      });
      setEditItem(null);
      fetchItems(user.uid);
      setOpenDialog(false);
    }
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'pantryItems', id));
    fetchItems(user.uid);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <Auth onLogin={() => fetchItems(user?.uid)} />;
  }

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Manager
          </Typography>
          <Button color="inherit" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
            Add Item
          </Button>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <TextField
          label="Search items"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton size="small" onClick={() => { setEditItem(item); setOpenDialog(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Item Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editItem ? editItem.name : newItem.name}
              onChange={(e) => {
                const value = e.target.value;
                editItem ? setEditItem({ ...editItem, name: value }) : setNewItem({ ...newItem, name: value });
              }}
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={editItem ? editItem.quantity : newItem.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  editItem ? setEditItem({ ...editItem, quantity: value }) : setNewItem({ ...newItem, quantity: value });
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={editItem ? updateItem : addItem} variant="contained" color="primary">
              {editItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
