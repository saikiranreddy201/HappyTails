import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    const [pets, setPets] = useState([])

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User's Pets using API
    const loadUserPets = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/pet', { headers: { token } })
            
            if (data.success) {
                setPets(data.pets)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Add Pet
    const addPet = async (petData) => {
        try {
            const formData = new FormData()
            formData.append('name', petData.name)
            formData.append('breed', petData.breed)
            formData.append('age', petData.age)
            formData.append('weight', petData.weight)
            formData.append('gender', petData.gender)
            
            if (petData.image) {
                formData.append('image', petData.image)
            }

            const { data } = await axios.post(backendUrl + '/api/pet', formData, { 
                headers: { 
                    token
                } 
            })
            
            if (data.success) {
                toast.success(data.message)
                loadUserPets() // Reload pets
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return false
        }
    }

    // Update Pet
    const updatePet = async (petId, petData) => {
        try {
            const formData = new FormData()
            formData.append('name', petData.name)
            formData.append('breed', petData.breed)
            formData.append('age', petData.age)
            formData.append('weight', petData.weight)
            formData.append('gender', petData.gender)
            
            if (petData.image) {
                formData.append('image', petData.image)
            }

            const { data } = await axios.put(backendUrl + `/api/pet/${petId}`, formData, { 
                headers: { 
                    token
                } 
            })
            
            if (data.success) {
                toast.success(data.message)
                loadUserPets() // Reload pets
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return false
        }
    }

    // Delete Pet
    const deletePet = async (petId) => {
        try {
            const { data } = await axios.delete(backendUrl + `/api/pet/${petId}`, { headers: { token } })
            
            if (data.success) {
                toast.success(data.message)
                loadUserPets() // Reload pets
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return false
        }
    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
            loadUserPets()
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        pets, setPets, loadUserPets, addPet, updatePet, deletePet
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider