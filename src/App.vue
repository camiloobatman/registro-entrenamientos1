<template>
  <div class="container">
    <div class="card-form">
      <h1>Registrar Entrenamiento</h1>

      <form @submit.prevent="guardarEntrenamiento">
        <div class="campo">
          <label>Fecha</label>
          <input type="date" v-model="fecha" required />
        </div>

        <div class="campo">
          <label>Duración (minutos)</label>
          <input
            type="number"
            v-model="duracion"
            placeholder="Ej: 60"
            required
          />
        </div>

        <div class="campo">
          <label>Distancia (km)</label>
          <input
            type="number"
            step="0.1"
            v-model="distancia"
            placeholder="Ej: 5"
            required
          />
        </div>

        <button type="submit" class="btn-principal">
          {{ editando ? "Actualizar" : "Registrar" }}
        </button>

        <button
          v-if="editando"
          type="button"
          class="btn-secundario"
          @click="cancelarEdicion"
        >
          Cancelar
        </button>
      </form>
    </div>

    <h2 class="titulo-historial">Historial</h2>

    <div v-for="item in entrenamientos" :key="item.id" class="card">
      <p><strong>Fecha:</strong> {{ item.fecha }}</p>
      <p><strong>Duración:</strong> {{ item.duracion }} min</p>
      <p><strong>Distancia:</strong> {{ item.distancia }} km</p>

      <div class="acciones">
        <button @click="cargarEdicion(item)">✏️</button>
        <button @click="eliminarEntrenamiento(item.id!)">❌</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { db } from "./firebase"
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore"

interface Entrenamiento {
  id?: string
  fecha: string
  duracion: number
  distancia: number
}

const fecha = ref("")
const duracion = ref<number | null>(null)
const distancia = ref<number | null>(null)
const entrenamientos = ref<Entrenamiento[]>([])
const editando = ref(false)
const idEditando = ref<string | null>(null)

const entrenamientosRef = collection(db, "entrenamientos")

// 🔥 Query ordenado por fecha descendente
const entrenamientosQuery = query(
  entrenamientosRef,
  orderBy("fecha", "desc")
)

const guardarEntrenamiento = async () => {
  if (!fecha.value || duracion.value === null || distancia.value === null) return

  const datos = {
    fecha: fecha.value,
    duracion: Number(duracion.value),
    distancia: Number(distancia.value)
  }

  if (editando.value && idEditando.value) {
    await updateDoc(doc(db, "entrenamientos", idEditando.value), datos)
  } else {
    await addDoc(entrenamientosRef, datos)
  }

  limpiarFormulario()
}

const eliminarEntrenamiento = async (id: string) => {
  await deleteDoc(doc(db, "entrenamientos", id))
}

const cargarEdicion = (item: Entrenamiento) => {
  fecha.value = item.fecha
  duracion.value = item.duracion
  distancia.value = item.distancia
  idEditando.value = item.id || null
  editando.value = true
}

const cancelarEdicion = () => {
  limpiarFormulario()
}

const limpiarFormulario = () => {
  fecha.value = ""
  duracion.value = null
  distancia.value = null
  editando.value = false
  idEditando.value = null
}

onMounted(() => {
  onSnapshot(entrenamientosQuery, (snapshot) => {
    entrenamientos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Entrenamiento, "id">)
    }))
  })
})
</script>

<style>
body {
  background: #f4f6f9;
  margin: 0;
}

.container {
  max-width: 500px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

.card-form {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #42b883;
}

.btn-principal {
  background: #42b883;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.btn-principal:hover {
  opacity: 0.9;
}

.btn-secundario {
  background: #ccc;
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.titulo-historial {
  text-align: center;
  margin-top: 30px;
}

.card {
  background: white;
  padding: 15px;
  margin-top: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.acciones {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
