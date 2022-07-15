import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card/Card';
import { Navber } from './components/Navber/Navber';
import { getAllPokemon, getPokemon } from './utils/pokemon';

type Pokemon = {
  name: string;
  url: string;
}

function App() {
  const initialURL="https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setpokemonData] = useState<Array<Pokemon>>([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");


useEffect(()=>{
  const fetchPokemonData = async () => {
    //全てのポケモンデータを取得
    const res= await getAllPokemon(initialURL);
    //各ポケモンの詳細なデータを取得
    //console.log(res);
    loadPokemon(res.results);
    setNextURL(res.next);
    setPrevURL(res.previous);
    setLoading(false);
  };
  fetchPokemonData();
},[]);

  const loadPokemon = async (data: string[]) => {
    let _pokemonData= await Promise.all(
      data.map((pokemon)=>{
        console.log("pokemon")
        console.log(pokemon)
        let pokemonrecord = getPokemon(pokemon.url);
        return pokemonrecord;
      })
    );
    
    
    setpokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  const handleNextPage = async () => { 
    setLoading(true);
    let data = await getAllPokemon(nextURL); 
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const handlePrevPage = ()=>{
    if(!prevURL) return;
    setLoading(true);
    let data= await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false); 
  };


  return (
    <>
    <Navber />
    <div className="App">
     {loading ? (
      <h1>ロード中...</h1>
     ):(
      <>
       <div className="pokemonCardContainer">
        {pokemonData.map((pokemon, i)=>{
          return <Card key={i} pokemon={pokemon} />;
        })}
       </div>
       <div className='btn'>
        <button onClick={handlePrevPage}>前へ</button>
        <button onClick={handleNextPage}>次へ</button>
       </div>
      </>
     )}
    </div>
    </>
  );
}

export default App;

