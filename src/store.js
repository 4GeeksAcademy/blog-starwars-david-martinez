export const initialStore = () => {
  return {
    people: [],
    planets: [],
    vehicles: [],
    favorites: [] // Aquí guardaremos los nombres de lo que nos guste
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_people':
      return { ...store, people: action.payload };
    case 'set_planets':
      return { ...store, planets: action.payload };
    case 'set_vehicles':
      return { ...store, vehicles: action.payload };
    
    case 'add_favorite':
      // Si el nombre ya está en la lista, devuelvo el store tal cual, asi no se duplica en el desplegable 
      if (store.favorites.includes(action.payload)) return store;
      // Si no existe, creo un nuevo array con el contenido anterior + el nuevo favorito
      return { ...store, favorites: [...store.favorites, action.payload] };

    case 'delete_favorite':
      return {
        ...store,
        // Filtro la lista para eliminar el nombre que coincida con el payload
        favorites: store.favorites.filter((item) => item !== action.payload)
      };

    default:
      return store;
  }
}