import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import Navbaradmin from './Navbaradmin.js';

export default function EditArticles() {
    let { id } = useParams()

    const { handleSubmit, formState: { errors } } = useForm();
    let navigate = useNavigate();

    const [name, setName] = useState("")
    const [prix, setPrix] = useState("")
    const [image, setImage] = useState("")
    const [quantite, setQuantite] = useState("")

    const recup = async () => {
        await axios.get(`http://localhost:8000/articles/` + id)
            .then(res => {
                setName(res.data[0].name)
                setPrix(res.data[0].prix)
                setImage(res.data[0].image)
                setQuantite(res.data[0].quantite)
            })
    }

    const editArticles= async () => {
        await axios.put(`http://localhost:8000/articles/` + id, {
            name: name,
            prix: prix,
            image: image,
            quantite: quantite
        })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    alert("Envoie réussi")
                    navigate("/ModifyArticles");
                }
                else {
                    alert("Erreur d'envoi")
                }
            })
    }
    
    useEffect(() => {
        recup()
    }, [])

    return (
    <div>
        <Navbaradmin/>
        <div className='container'>
            <h2> Editer un article</h2>

            <form onSubmit={handleSubmit(editArticles)}>
                <label>Nom : </label>
                <input defaultValue={name} onChange={(e) => setName(e.target.value)} />
                <br/>
                <label>Prix : </label>
                <input defaultValue={prix} onChange={(e) => setPrix(e.target.value)} />
                <br/>
                <label>image : </label>
                <input defaultValue={image} onChange={(e) => setImage(e.target.value)} />
                <br/>
                <label>Quantité : </label>
                <input defaultValue={quantite} onChange={(e) => setQuantite(e.target.value)} />

                {(errors.name || errors.prix || errors.image || errors.quantite) ? <span>Tous les champs doivent être remplis</span> : ""}
                <br/>
                <input type="submit" />
            </form>
        </div>
    </div>
    )
}
