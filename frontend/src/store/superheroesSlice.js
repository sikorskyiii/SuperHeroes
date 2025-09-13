import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchPage = createAsyncThunk('heroes/fetchPage', async ({ page = 1, limit = 5 } = {}) => {
  const { data } = await axios.get(`/api/superheroes?page=${page}&limit=${limit}`)
  return data
})

export const fetchHero = createAsyncThunk('heroes/fetchHero', async (id) => {
  const { data } = await axios.get(`/api/superheroes/${id}`)
  return data
})

export const createHero = createAsyncThunk('heroes/createHero', async (payload) => {
  const { data } = await axios.post('/api/superheroes', payload)
  return data
})

export const updateHero = createAsyncThunk('heroes/updateHero', async ({ id, payload }) => {
  const { data } = await axios.put(`/api/superheroes/${id}`, payload)
  return data
})

export const deleteHero = createAsyncThunk('heroes/deleteHero', async (id) => {
  await axios.delete(`/api/superheroes/${id}`)
  return id
})

export const addImageFile = createAsyncThunk('heroes/addImageFile', async ({ id, file }) => {
  const form = new FormData()
  form.append('image', file)
  const { data } = await axios.post(`/api/superheroes/${id}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return { id, image: data }
})


export const removeImage = createAsyncThunk('heroes/removeImage', async ({ id, imageId }) => {
  await axios.delete(`/api/superheroes/${id}/images/${imageId}`)
  return { id, imageId }
})

export const uploadImage = createAsyncThunk('heroes/uploadImage', async (file) => {
  const form = new FormData()
  form.append('image', file)
  const { data } = await axios.post('/api/upload', form)
  return data.url
})

const slice = createSlice({
  name: 'superheroes',
  initialState: {
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0,
    items: [],
    current: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPage.pending, (state) => { state.status = 'loading' })
      .addCase(fetchPage.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
        state.status = 'succeeded'
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.error.message
      })
      .addCase(fetchHero.fulfilled, (state, action) => { state.current = action.payload })
      .addCase(createHero.fulfilled, (state, action) => {
        if (state.page === 1) state.items.unshift(action.payload)
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        if (state.current?.id === action.payload.id) state.current = action.payload
        const idx = state.items.findIndex(i => i.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })
      .addCase(deleteHero.fulfilled, (state, action) => {
        const id = action.payload
        state.items = state.items.filter(i => i.id !== id)
        if (state.current?.id === id) state.current = null
      })
      .addCase(addImageFile.fulfilled, (state, action) => {
        const { id, image } = action.payload
        if (state.current?.id === id) state.current.images.push(image)
      })
      .addCase(removeImage.fulfilled, (state, action) => {
        const { id, imageId } = action.payload
        if (state.current?.id === id) {
          state.current.images = state.current.images.filter(img => img.id !== imageId)
        }
      })
  }
})

export default slice.reducer
