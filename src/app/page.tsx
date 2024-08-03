'use client'

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Grid, Card, CardContent, 
  CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  AppBar, Toolbar, InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import Auth from '../components/Auth';
import categoriesData from '../categories.json';
import FilterPanel from '../components/filterPanel';

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  userId: string;
  expirationDate: string;
  category: string;
}

export default function Home() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, expirationDate: '', category: '' });
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>(items);

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
    setFilteredItems(fetchedItems); // Initialize filtered items
  };

  const addItem = async () => {
    if (newItem.name && newItem.quantity > 0 && user) {
      await addDoc(collection(db, 'pantryItems'), { 
        ...newItem, 
        userId: user.uid,
        expirationDate: newItem.expirationDate || null,
        category: newItem.category || 'Uncategorized'
      });
      setNewItem({ name: '', quantity: 0, expirationDate: '', category: '' });
      fetchItems(user.uid);
      setOpenDialog(false);
    }
  };
  
  const updateItem = async () => {
    if (editItem && editItem.name && editItem.quantity > 0) {
      await updateDoc(doc(db, 'pantryItems', editItem.id), {
        name: editItem.name,
        quantity: editItem.quantity,
        expirationDate: editItem.expirationDate || null,
        category: editItem.category || 'Uncategorized'
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

  const handleFilter = (category: string, date: string) => {
    let filtered = items;
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    if (date) {
      const filterDate = new Date(date).getTime();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.expirationDate).getTime();
        return itemDate <= filterDate; // Include items expiring on or before the provided date
      });
    }
    setFilteredItems(filtered);
  };

  const filteredSearchItems = filteredItems.filter(item =>
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

        <FilterPanel onFilter={handleFilter} />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {filteredSearchItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expiration: {item.expirationDate || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {item.category || 'Uncategorized'}
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
            <TextField
              margin="dense"
              label="Expiration Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={editItem ? editItem.expirationDate : newItem.expirationDate}
              onChange={(e) => {
                const value = e.target.value;
                editItem ? setEditItem({ ...editItem, expirationDate: value }) : setNewItem({ ...newItem, expirationDate: value });
              }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={editItem ? editItem.category : newItem.category}
                label="Category"
                onChange={(e) => {
                  const value = e.target.value;
                  editItem 
                    ? setEditItem({ ...editItem, category: value }) 
                    : setNewItem({ ...newItem, category: value });
                }}
              >
                {categoriesData.categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

