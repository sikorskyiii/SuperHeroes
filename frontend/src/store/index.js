import { configureStore } from '@reduxjs/toolkit'
import superheroes from './superheroesSlice.js'

export default configureStore({
  reducer: { superheroes }
})
