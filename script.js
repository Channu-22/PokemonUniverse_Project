// console.log("Jai jagannath");
let offSet=0;
let limit=20;
const typeUrl="https://pokeapi.co/api/v2/type/?limit=21";
const pokeUrl="https://pokeapi.co/api/v2/pokemon?limit="+limit+"&offset=" + offSet;

const select=document.querySelector("#types");
const pokemonDiv=document.querySelector(".pokemons");
const search=document.querySelector("#search");
const addMore=document.querySelector(".addMore");
const loaderDiv=document.querySelector(".loader-container");
const reset=document.querySelector("#reset");

// console.log(addMore)
// console.log(pokemonDiv)
// console.log(select)

let types;
let poke;
let finalData=[];


reset.addEventListener("click" , (e) =>{
    search.innerHTML="";
    
    displayPokemons(finalData);
})

// IF I CLICK + BUTTON IT WILL ADD 2 MORE POKEMONS
addMore.addEventListener("click" , (e) => {
    offSet=offSet+limit;
    // console.log(offSet)
    getPokemons("https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + offSet)
})
// NAAVU SELECT MAADIDU POKEMON BARATADA
select.addEventListener("change" , (e) =>{
    let copy=finalData;
    // console.log(finalData)
    if(e.target.value == "all"){
        displayPokemons(finalData);
    }
    else{
        // console.log(copy)
        displayPokemons ( copy.filter((singlePokemonType) => {
            return  singlePokemonType.types.some((pokemon) => {
                return pokemon.type.name === e.target.value;
            })
        }))
    }
});

search.addEventListener("keyup",(e) =>{
    // console.log(e.target.value.length)
    if(e.target.value.length <= 3){
        displayPokemons(finalData);
    }
    else{
        const searchedPokemon = finalData.filter((obj) => {
            // console.log(obj)
            return obj.name.includes(e.target.value);
        });
        if(searchedPokemon.length === 0){
            pokemonDiv.innerHTML="";
            const noResults = document.createElement("h1");
            noResults.innerText = "No Pokemon Found";
            noResults.classList.add("no-results"); // Added a class for CSS styling
            pokemonDiv.appendChild(noResults);
        }
        else{
            displayPokemons(searchedPokemon);
        }
    }
})

getTypes();
// FETCHING TYPES OF POKEMONS
async function getTypes(){
    types=await getfetchedData(typeUrl);
   
    types=types.results;
    // console.log(types)
    createOption(types);
    
}
// ADDING TYPES TO DOM
function createOption(data){
    const fragment=document.createDocumentFragment();
    data.forEach((element) => {
        const option=document.createElement("option");
        option.value=element.name;
        option.innerText=element.name;
        fragment.append(option);

    });
    select.append(fragment);
}

getPokemons(pokeUrl);
// FETCHING ALL POKEMONS 
async function getPokemons(url){
    poke=await getfetchedData(url);
    // poke=poke.results;
    // console.log(poke)
    // const promises=[];
    // poke.forEach((obj) =>{
    //     promises.push(getfetchedData(obj.url));
    // })
    // finalData=await Promise.all(promises);
    // console.log(finalData)

    const newData=await Promise.all(poke.results.map((obj) => {
        return getfetchedData(obj.url);
    }));
    // console.log(newData)
    // finalData=[bulbasur,ivvyasur]  and newData=[raticate,pikachu]
    // finalData=[bulbasur,ivvyasur,raticate,pikachu] 

    // IT WILL ADD PREVIOUS AND CURRENT POKEMON TO FINALDATA
    finalData=finalData.concat(newData);
    displayPokemons(finalData);

    // console.log(poke)
    // poke=await getfetchedData(poke);
}

// ADDING TO DIRECTLY DOM THROUGH FRAGMENT
function displayPokemons(data){
    pokemonDiv.innerHTML="";
    loaderDiv.style.display="block";
    const fragment=document.createDocumentFragment();
    data.forEach((obj) => {
        console.log(obj)
        const parent=document.createElement("div");
        parent.classList.add("parent");
        
        const image=document.createElement("img");
        image.classList.add("img")

        const name=document.createElement("h2");
        name.classList.add("h2");

        const type=document.createElement("p");
        type.classList.add("p");

        image.src=obj.sprites.other.dream_world.front_default;
        name.innerText=obj.name;

        // console.log(obj.types)
        let types=[];
        obj.types.forEach((object) => {
            types.push(object.type.name);
        })
        // console.log(types)
        type.innerHTML=  "<strong>Type:</strong>" + types.toString();
        


        const front = document.createElement("div");
        front.classList.add("front");

        const back = document.createElement("div");
        back.classList.add("back");

        const ability=document.createElement("p");
        ability.classList.add("p");

        const height=document.createElement("p");
        height.classList.add("p");

        const weight=document.createElement("p");
        weight.classList.add("p");


        ability.innerHTML=`<strong>Ability:</strong> ${obj.abilities[0].ability.name}`;
        height.innerHTML=`<strong>Height:</strong> ${obj.height}`;
        weight.innerHTML=`<strong>Weight:</strong> ${obj.weight}`;
        console.log(weight)

        back.append(ability,height,weight);
        
        
        
        front.append(image, name, type);
        parent.append(front, back);


        // parent.append(image,name,type);
        

        fragment.append(parent);
    });
    loaderDiv.style.display="none";
    
    pokemonDiv.append(fragment);
}

async function getfetchedData(url){
    const response=await fetch(url);
    // console.log(response)
    let result=await response.json();
    return result;
}