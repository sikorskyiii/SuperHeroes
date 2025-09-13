import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchPage   = createAsyncThunk('heroes/fetchPage',   async ({ page=1, limit=5 }={}) => {
  const { data } = await axios.get(`/api/superheroes?page=${page}&limit=${limit}`); return data
})
export const fetchHero   = createAsyncThunk('heroes/fetchHero',   async (id) => {
  const { data } = await axios.get(`/api/superheroes/${id}`); return data
})
export const createHero  = createAsyncThunk('heroes/createHero',  async (payload) => {
  const { data } = await axios.post('/api/superheroes', payload); return data
})
export const updateHero  = createAsyncThunk('heroes/updateHero',  async ({ id, payload }) => {
  const { data } = await axios.put(`/api/superheroes/${id}`, payload); return data
})
export const deleteHero  = createAsyncThunk('heroes/deleteHero',  async (id) => {
  await axios.delete(`/api/superheroes/${id}`); return id
})

export const addImageFile = createAsyncThunk('heroes/addImageFile', async ({ id, file }) => {
  const form = new FormData(); form.append('image', file)
  const { data } = await axios.post(`/api/superheroes/${id}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return { id, image: data }
})

export const removeImage = createAsyncThunk('heroes/removeImage', async ({ id, imageId }) => {
  await axios.delete(`/api/superheroes/${id}/images/${imageId}`)
  return { id, imageId }
})

const slice = createSlice({
  name: 'superheroes',
  initialState: { page:1, pageSize:5, total:0, totalPages:0, items:[], current:null, status:'idle', error:null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPage.pending,(s)=>{s.status='loading'})
     .addCase(fetchPage.fulfilled,(s,a)=>{Object.assign(s,a.payload); s.status='succeeded'})
     .addCase(fetchPage.rejected,(s,a)=>{s.status='failed'; s.error=a.error.message})
     .addCase(fetchHero.fulfilled,(s,a)=>{s.current=a.payload})
     .addCase(createHero.fulfilled,(s,a)=>{ if(s.page===1) s.items.unshift(a.payload) })
     .addCase(updateHero.fulfilled,(s,a)=>{ if(s.current?.id===a.payload.id) s.current=a.payload; const i=s.items.findIndex(x=>x.id===a.payload.id); if(i>=0) s.items[i]=a.payload })
     .addCase(deleteHero.fulfilled,(s,a)=>{ const id=a.payload; s.items=s.items.filter(x=>x.id!==id); if(s.current?.id===id) s.current=null })
     .addCase(addImageFile.fulfilled,(s,a)=>{ const {id,image}=a.payload; if(s.current?.id===id) s.current.images.push(image) })
     .addCase(removeImage.fulfilled,(s,a)=>{ const {id,imageId}=a.payload; if(s.current?.id===id) s.current.images=s.current.images.filter(i=>i.id!==imageId) })
  }
})

export default slice.reducer
