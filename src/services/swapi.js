import { ACTION_TYPES } from "../store";

const API_BASE_URL = "https://www.swapi.tech/api";
const IMAGE_FOLDERS = {
  people: "characters",
  planets: "planets",
  vehicles: "vehicles",
};
const PLACEHOLDER_IMAGE = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
const DETAIL_FIELDS = {
  people: ["birth_year", "gender", "height", "skin_color", "eye_color", "hair_color"],
  planets: ["climate", "population", "orbital_period", "rotation_period", "diameter", "terrain"],
  vehicles: ["model", "vehicle_class", "manufacturer", "crew", "passengers", "cost_in_credits"],
};

const requestJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`SWAPI responded with status ${response.status}`);
  }

  const payload = await response.json();

  if (!payload) {
    throw new Error("SWAPI returned an empty response.");
  }

  return payload;
};

const normalizeDetail = (type, uid, result) => ({
  uid: String(uid),
  type,
  name: result?.properties?.name || "Unknown resource",
  description: result?.description || "",
  properties: result?.properties || {},
});

export const isSupportedType = (type) => Object.hasOwn(IMAGE_FOLDERS, type);

export const getResourceImageUrl = (type, uid) => {
  if (!isSupportedType(type)) return PLACEHOLDER_IMAGE;

  return `https://starwars-visualguide.com/assets/img/${IMAGE_FOLDERS[type]}/${uid}.jpg`;
};

export const getPlaceholderImage = () => PLACEHOLDER_IMAGE;

export const formatPropertyLabel = (propertyName) =>
  propertyName.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());

export const getDetailHighlights = (type, properties = {}) =>
  (DETAIL_FIELDS[type] || []).map((fieldName) => ({
    key: fieldName,
    label: formatPropertyLabel(fieldName),
    value: properties[fieldName] || "Unknown",
  }));

export const getIntroText = (type, properties = {}) => {
  switch (type) {
    case "people":
      return `${properties.name || "This character"} has ${properties.eye_color || "unknown"} eyes, ${properties.hair_color || "unknown"} hair and was born in ${properties.birth_year || "an unknown year"}.`;
    case "planets":
      return `${properties.name || "This planet"} features ${properties.climate || "unknown"} climate, ${properties.terrain || "unknown"} terrain and a population of ${properties.population || "unknown"}.`;
    case "vehicles":
      return `${properties.name || "This vehicle"} is a ${properties.vehicle_class || "specialized vehicle"} built by ${properties.manufacturer || "an unknown manufacturer"} with model ${properties.model || "unknown"}.`;
    default:
      return "Resource details unavailable.";
  }
};

const fetchCategory = async (type) => {
  const payload = await requestJson(`${API_BASE_URL}/${type}`);
  return Array.isArray(payload.results) ? payload.results : [];
};

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

export const loadDetail = async (
  dispatch,
  { type, uid, cachedDetail = null, forceReload = false }
) => {
  if (!isSupportedType(type)) {
    dispatch({
      type: ACTION_TYPES.loadDetailError,
      payload: `Unsupported resource type: ${type}`,
    });
    return;
  }

  dispatch({
    type: ACTION_TYPES.loadDetailStart,
    payload: `${type}:${uid}`,
  });

  if (cachedDetail && !forceReload) {
    dispatch({
      type: ACTION_TYPES.loadDetailSuccess,
      payload: cachedDetail,
    });
    return;
  }

  try {
    const payload = await requestJson(`${API_BASE_URL}/${type}/${uid}`);

    if (!payload?.result?.properties) {
      throw new Error("The API response is missing detail properties.");
    }

    dispatch({
      type: ACTION_TYPES.loadDetailSuccess,
      payload: normalizeDetail(type, uid, payload.result),
    });
  } catch (error) {
    dispatch({
      type: ACTION_TYPES.loadDetailError,
      payload: error.message || "Unable to load this resource.",
    });
  }
};
