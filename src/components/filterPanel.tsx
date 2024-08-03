import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import categoriesData from '../categories.json';

interface FilterPanelProps {
  onFilter: (category: string, date: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter }) => {
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleFilter = () => {
    onFilter(category, date);
  };

  const handleReset = () => {
    setCategory('');
    setDate('');
    onFilter('', '');
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categoriesData.categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Expiration Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleFilter}>
        Filter
      </Button>
      <Button variant="outlined" onClick={handleReset}>
        Reset
      </Button>
    </Box>
  );
};

export default FilterPanel;
