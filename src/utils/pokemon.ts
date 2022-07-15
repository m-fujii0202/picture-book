import { rejects } from "assert"

export const getAllPokemon = (url: RequestInfo | URL)=>{
    return new Promise((resolve,rejects)=>{
        fetch(url)
        .then((res)=> res.json())
        .then((data)=>resolve(data))
    })
}