'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, InputBase } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1a1a2e', // Dark background color
  border: '2px solid #38ef7d', // Light green border color
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'))
    const inventoryList = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data()
    }))
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    if (!item) return; // Avoid adding empty items

    const normalizedItem = item.toLowerCase(); // Normalize to lowercase
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const normalizedItem = item.toLowerCase(); // Normalize to lowercase
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    updateInventory()
  }, [])

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      bgcolor={'#0f0f23'} // Dark background for the whole page
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      padding={2}
    >
      <Box
        width="100%"
        maxWidth="1000px" // Make the green box wider
        height="85vh" // Make the green box fill most of the screen height
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="auto"
        flexGrow={1}
        gap={2}
        border={'1px solid #38ef7d'} // Light green border
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ bgcolor: '#38ef7d', color: '#1a1a2e', alignSelf: 'flex-start', marginTop: 2 }} // Light green button with dark text
        >
          Add New Item
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color="#ffffff"> {/* White text color */}
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ input: { color: '#ffffff' }, label: { color: '#38ef7d' }, fieldset: { borderColor: '#38ef7d' } }} // White input text and light green label
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
                sx={{ color: '#38ef7d', borderColor: '#38ef7d' }} // Light green button
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box width="100%" padding={2}> 
          <InputBase
            placeholder="Search items..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ bgcolor: '#1a1a2e', color: '#ffffff', padding: 1, borderRadius: 1, border: '1px solid #38ef7d' }}
          />
        </Box>

        <Box width="100%"> 
          <Box
            width="100%"
            height="100px"
            bgcolor={'#1a1a2e'} // Dark background for header
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#38ef7d'} textAlign={'center'}> {/* Light green text color */}
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" spacing={2} overflow={'auto'} maxHeight="calc(100% - 100px)"> {/* Allow space for header */}
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#1a1a2e'} // Dark background for items
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#ffffff'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#ffffff'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)} sx={{ bgcolor: '#38ef7d', color: '#1a1a2e' }}> {/* Light green button with dark text */}
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
