# 📝 Code Review: Starwars Blog Reading List - David Martinez

**Repositorio:** `4GeeksAcademy/blog-starwars-david-martinez`  
**Base evaluada:** `origin/master`  
**Rúbrica aplicada:** `/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/solutions/day_21-starwars-blog-reading-list/RUBRIC.md`  
**Nota mínima de aprobación:** `85/100`

---

## ✅ Aspectos Positivos

1. **Buena base con store global**
   - La entrega ya usa [`src/store.js`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/store.js) y [`src/hooks/useGlobalReducer.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/hooks/useGlobalReducer.jsx), así que hay una intención correcta de trabajar con estado global.

2. **Home con las tres categorías**
   - En [`src/pages/Home.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Home.jsx) se renderizan personajes, planetas y vehículos con búsqueda y una UI visualmente cuidada.

3. **Feedback visual atractivo**
   - El proyecto tiene una identidad visual consistente, con buen uso de fondo, tarjetas y placeholders de imagen para que la experiencia no se rompa fácilmente.

4. **Favoritos ya estaban encaminados**
   - Había contador en navbar y estado de corazón en Home, lo que demuestra comprensión del flujo favorito/no favorito.

---

## 🔍 Áreas de Mejora

### 1. Los `fetch` estaban mezclados dentro de las vistas

**Observación:**
La carga del catálogo vivía directamente en [`src/pages/Home.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Home.jsx) usando `fetch` y `localStorage`, en vez de separarse en una capa de servicios como pide la rúbrica.

**Código actual (original):**
```javascript
endpoints.forEach(type => {
    fetch(`https://www.swapi.tech/api/${type}`)
        .then(res => res.json())
        .then(data => {
            dispatch({ type: `set_${type}`, payload: data.results });
            localStorage.setItem(type, JSON.stringify(data.results));
        })
        .catch(err => console.error(`Ups, hubo un error en ${type}:`, err));
});
```

**Código mejorado (aplicado):**
```javascript
useEffect(() => {
    loadCatalog(dispatch, { hasLoaded: store.status.catalog.hasLoaded });
}, [dispatch, store.status.catalog.hasLoaded]);
```

```javascript
export const loadCatalog = async (
  dispatch,
  { hasLoaded = false, forceReload = false } = {}
) => {
  if (hasLoaded && !forceReload) return;

  dispatch({ type: ACTION_TYPES.loadCatalogStart });

  try {
    const [people, planets, vehicles] = await Promise.all([
      fetchCategory("people"),
      fetchCategory("planets"),
      fetchCategory("vehicles"),
    ]);

    dispatch({
      type: ACTION_TYPES.loadCatalogSuccess,
      payload: { people, planets, vehicles },
    });
  } catch (error) {
    dispatch({
      type: ACTION_TYPES.loadCatalogError,
      payload: error.message || "Unable to load the Star Wars catalog.",
    });
  }
};
```

**¿Por qué esta mejora?**
- La vista deja de mezclar UI con acceso HTTP.
- Se centraliza la lógica asíncrona en un solo archivo reutilizable.
- Queda preparado `loading`, `error` y `retry` de forma consistente.

### 2. Favoritos guardados solo por nombre

**Observación:**
En la entrega original, el store guardaba solo strings. Eso es frágil porque un favorito no debería identificarse solo por `name`, sino por `uid` y `type`.

**Código actual (original):**
```javascript
case 'add_favorite':
  if (store.favorites.includes(action.payload)) return store;
  return { ...store, favorites: [...store.favorites, action.payload] };
```

**Código mejorado (aplicado):**
```javascript
case ACTION_TYPES.toggleFavorite: {
  const favorite = {
    uid: String(action.payload.uid),
    type: action.payload.type,
    name: action.payload.name,
  };
  const exists = store.favorites.some(
    (item) => item.uid === favorite.uid && item.type === favorite.type
  );

  return exists
    ? {
        ...store,
        favorites: store.favorites.filter(
          (item) =>
            !(item.uid === favorite.uid && item.type === favorite.type)
        ),
      }
    : {
        ...store,
        favorites: [...store.favorites, favorite],
      };
}
```

**¿Por qué esta mejora?**
- Evita colisiones por nombres repetidos.
- Permite enlazar cada favorito a su vista de detalle correcta.
- Hace el dropdown de favoritos mucho más útil.

### 3. La vista de detalle no era realmente robusta para todas las categorías

**Observación:**
[`src/pages/Single.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Single.jsx) cargaba el detalle directamente, no tenía `retry`, no validaba rutas y el bloque informativo estaba preparado sobre todo para `people` y `planets`, dejando `vehicles` incompleto.

**Código actual (original):**
```javascript
fetch(`https://www.swapi.tech/api/${type}/${uid}`)
    .then(res => res.json())
    .then(data => {
        setItem(data.result.properties);
        setLoading(false);
    })
    .catch(err => {
        console.error("Error fetching details:", err);
        setLoading(false);
    });
```

```javascript
{type === "people" 
    ? `${item?.name} is a fascinating character ...`
    : `${item?.name} is a celestial body ...`
}
```

**Código mejorado (aplicado):**
```javascript
useEffect(() => {
    loadDetail(dispatch, {
        type,
        uid: String(uid),
        cachedDetail: item
    });
}, [dispatch, type, uid]);
```

```javascript
if (store.status.detail.error && !item) {
    return (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{store.status.detail.error}</span>
            <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() =>
                    loadDetail(dispatch, {
                        type,
                        uid: String(uid),
                        cachedDetail: item,
                        forceReload: true
                    })
                }
            >
                Retry
            </button>
        </div>
    );
}
```

**¿Por qué esta mejora?**
- El detalle ahora soporta personajes, planetas y vehículos de forma consistente.
- Hay manejo explícito de `loading`, `error`, `retry` y ruta inválida.
- Se reutiliza cache en el store para no pedir el mismo detalle innecesariamente.

### 4. La ruta y los archivos legacy no estaban del todo limpios

**Observación:**
La app seguía usando la ruta `single/:type/:uid` y mantenía [`src/pages/Demo.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Demo.jsx), que no formaba parte del flujo real.

**Código actual (original):**
```javascript
path: "single/:type/:uid",
element: <Single />
```

**Código mejorado (aplicado):**
```javascript
path: ":type/:uid",
element: <Single />
```

**¿Por qué esta mejora?**
- La URL queda más limpia y alineada con la rúbrica del proyecto.
- Se reduce código muerto.
- El router describe mejor la intención real de la aplicación.

---

## 🎯 Patrones y Anti-patrones Identificados

### Patrones Positivos Encontrados ✅

1. **Store global con reducer**
   - **Tipo:** Patrón ✅
   - **Dónde aparece:** [`src/store.js`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/store.js)
   - **¿Por qué es importante?**
   - Centraliza el estado compartido.
   - Evita props drilling innecesario.
   - Da una buena base para escalar el proyecto.

2. **Búsqueda en Home**
   - **Tipo:** Patrón ✅
   - **Dónde aparece:** [`src/pages/Home.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Home.jsx)
   - **¿Por qué es importante?**
   - Mejora la experiencia del usuario.
   - Demuestra control de estado local para UI.

3. **Fallback de imagen**
   - **Tipo:** Patrón ✅
   - **Dónde aparece:** [`src/pages/Home.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Home.jsx), [`src/pages/Single.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Single.jsx)
   - **¿Por qué es importante?**
   - Evita imágenes rotas.
   - Hace la UI más estable ante recursos faltantes.

### Anti-patrones a Mejorar ❌

1. **Fetch en la vista**
   - **Tipo:** Anti-patrón ❌
   - **Dónde aparece:** `origin/master` en [`src/pages/Home.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Home.jsx) y [`src/pages/Single.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Single.jsx)
   - **Alternativa aplicada:** [`src/services/swapi.js`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/services/swapi.js)

2. **Favoritos por nombre**
   - **Tipo:** Anti-patrón ❌
   - **Dónde aparece:** `origin/master` en [`src/store.js`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/store.js)
   - **Alternativa aplicada:** favoritos por `uid`, `type` y `name`.

3. **Detalle poco defensivo**
   - **Tipo:** Anti-patrón ❌
   - **Dónde aparece:** `origin/master` en [`src/pages/Single.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Single.jsx)
   - **Alternativa aplicada:** cache + `loading/error/retry` + validación de tipo.

4. **Archivo legacy sin uso**
   - **Tipo:** Anti-patrón ❌
   - **Dónde aparece:** `origin/master` en [`src/pages/Demo.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Demo.jsx)
   - **Alternativa aplicada:** eliminar archivo no usado.

---

## 📊 Evaluación Detallada

### Calificación Total: **72/100**

**Estado:** ⚠️ **NECESITA MEJORA** (mínimo 85)

### Criterios de Evaluación (Total: 72/100)

| Criterio | Puntos | Obtenido | Comentario |
|----------|--------|----------|------------|
| **Funcionalidad Básica** | 30 | 21 | Home y detalle existen, pero faltaban loading/error consistentes y la vista de detalle no trataba bien todas las categorías |
| **Código Limpio** | 20 | 17 | Buena base con `store.js` y `useGlobalReducer`, aunque quedaban archivos legacy y varias responsabilidades mezcladas en las vistas |
| **Estructura** | 15 | 10 | El reducer era puro y el hook global existía, pero faltaba la capa de servicios HTTP separada |
| **Buenas Prácticas** | 15 | 8 | Buen uso de `dispatch`, pero los `fetch` estaban en las vistas y los favoritos se identificaban solo por nombre |
| **HTML/CSS** | 10 | 9 | UI clara, visualmente consistente y usable |
| **UX/Animaciones** | 10 | 7 | Buen feedback visual general, pero faltaban retry, estados de error claros y navegación de favoritos más útil |
| **TOTAL** | **100** | **72** | **NECESITA MEJORA ⚠️** |

### Desglose de Puntos Perdidos (-28 puntos)

1. **-8 puntos** - Los `fetch` estaban mezclados en `Home` y `Single` en vez de vivir en un servicio dedicado.
2. **-6 puntos** - Faltaban estados consistentes de `loading`, `error` y `retry` para el catálogo y el detalle.
3. **-5 puntos** - Los favoritos solo guardaban nombres, no identidad real por `uid` y `type`.
4. **-4 puntos** - La ruta `single/:type/:uid` y `Demo.jsx` dejaban el proyecto menos alineado con la convención esperada.
5. **-3 puntos** - La vista de detalle no cubría igual de bien personajes, planetas y vehículos.
6. **-2 puntos** - No había cache de detalle ni manejo defensivo suficiente ante rutas/datos no válidos.

### Cómo Llegar a 100/100

Aplicando las correcciones de este PR:
- ✅ **+8 puntos** - Extraer toda la lógica HTTP a [`src/services/swapi.js`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/services/swapi.js).
- ✅ **+6 puntos** - Añadir `loading`, `error` y `retry` claros en Home y Single.
- ✅ **+5 puntos** - Guardar favoritos como objetos con `uid`, `type` y `name`.
- ✅ **+4 puntos** - Limpiar la ruta dinámica a `/:type/:uid` y eliminar [`src/pages/Demo.jsx`](/Users/erwinaguero/teaching/4geeks_academy_spain_fs_pt_129_grading/temp_review/blog-starwars-david-martinez/src/pages/Demo.jsx).
- ✅ **+3 puntos** - Hacer el detalle realmente dinámico para personajes, planetas y vehículos.
- ✅ **+2 puntos** - Añadir cache de detalle y manejo defensivo para rutas no soportadas.

**= 100/100** 🎉

---

## 📌 Resumen

| Aspecto | Estado |
|---------|--------|
| Catálogo inicial | ✅ Bien planteado |
| Patrón global de estado | ✅ Correcto pero incompleto |
| Separación de servicios | ⚠️ Faltaba |
| Favoritos | ⚠️ Mejorables |
| Detail / Error handling | ⚠️ Incompleto |

**Nota final:** El proyecto tiene una base visual y funcional buena, pero la entrega original no llegaba a aprobación con esta rúbrica porque aún mezclaba fetch con UI, tenía favoritos demasiado frágiles y la vista de detalle no era suficientemente robusta. Con las correcciones aplicadas en este PR queda bastante más alineado con el patrón esperado del día 21.
