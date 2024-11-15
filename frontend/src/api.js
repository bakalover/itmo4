const CORE_URL = "https://localhost:35443/routes";
const NAVIGATOR_URL = "https://localhost:34443/navigator";

function serverError() {
  throw new Error("Внутренняя ошибка сервера!");
}

const serializeBigInt = (obj) => {
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
};

export const getRoutes = async (
  filters = "",
  sortingFields = "",
  page = 0,
  size = 10,
) => {
  console.log("Filters:", filters);
  console.log("Sorting fields:", sortingFields);
  console.log("Page:", page);
  console.log("Size:", size);

  // Validation for page and size
  if (!Number.isInteger(page) || page < 0) {
    console.error("Page must be a non-negative integer");
    throw new Error("Page must be a non-negative integer");
  }

  if (!Number.isInteger(size) || size < 1) {
    console.error("Size must be a positive integer");
    throw new Error("Size must be a positive integer");
  }

  let url = `${CORE_URL}`;

  const queryParams = [];

  queryParams.push(`page=${page}`);
  queryParams.push(`size=${size}`);

  if (filters) {
    queryParams.push(`filter=${encodeURIComponent(filters)}`);
  }

  if (sortingFields) {
    queryParams.push(`sort=${encodeURIComponent(sortingFields)}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  console.log("Request URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404)
      throw new Error(
        await response.text()
      );
    else if (response.status === 400)
      throw new Error(await response.text());
    else serverError();
  }

  return await response.json();
};

export const addRoute = async (route) => {
  console.log("going to add", route);
  const response = await fetch(CORE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: serializeBigInt(route),
  });
  if (response.status === 200) return response;
  else if (response.status === 400)
    throw new Error(await response.text());
  else if (response.status === 409)
    throw new Error(await response.text());
  else serverError();
};

export const updateRouteById = async (id, route) => {
  console.log(id);
  console.log(route);

  const updatedRoute = { ...route };

  delete updatedRoute.from.id;
  delete updatedRoute.to.id;

  const response = await fetch(`${CORE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: serializeBigInt(updatedRoute),
  });
  if (response.status === 200) return response;
  else if (response.status === 400) throw new Error(await response.text());
  else if (response.status === 404)
    throw new Error(await response.text());
  else serverError();
};

export const addRoutesWithId = async (idTo, idFrom, distance) => {
  console.log("going to add", idTo, idFrom, distance);
  const response = await fetch(
    `${NAVIGATOR_URL}/route/add/${idFrom}/${idTo}/${distance}`,
    {
      method: "POST",
    },
  );
  if (response.status === 201) return response;
  else if (response.status === 400)
    throw new Error(
      await response.text()
    );
  else serverError();
};

export const getRouteBeetweenLocations = async (idFrom, idTo) => {
  console.log("getting beetween locations", idTo, idFrom);
  const response = await fetch(`${NAVIGATOR_URL}/routes/${idFrom}/${idTo}/id`, {
    method: "GET",
  });
  if (response.status === 200) return await response.json();
  else if (response.status === 400)
    throw new Error(
      await response.text()
    );
  else if (response.status === 404) throw new Error(await response.text());
  else serverError();
};

export const fetchMinRoute = async () => {
  const response = await fetch(`${CORE_URL}/min-id`);
  if (response.status === 200) return await response.json();
  else if (response.status === 404) throw Error(await response.text());
  else serverError();
};

export const getRouteById = async (id) => {
  const response = await fetch(`${CORE_URL}/${id}`);
  if (response.status === 200) return await response.json();
  else if (response.status === 400)
    throw Error(await response.text());
  else if (response.status === 404) throw Error(await response.text());
  else serverError();
};

export const getRoutesWithDistanceGreater = async (distance) => {
  const response = await fetch(`${CORE_URL}/distance/greater/${distance}`);

  if (response.status === 200) return await response.json();
  else if (response.status === 400)
    throw Error(await response.text());
  else if (response.status === 404) throw Error(await response.text());
  else serverError();
};

export const getRoutesWithDistanceCount = async (distance) => {
  const response = await fetch(`${CORE_URL}/distance/count/${distance}`);

  if (response.status === 200) return Number(await response.text());
  else if (response.status === 400)
    throw Error(await response.text());
  else if (response.status === 404) throw Error(await response.text());
  else serverError();
};

export const deleteRouteById = async (id) => {
  const response = await fetch(`${CORE_URL}/${id}`, {
    method: "DELETE",
  });
  if (response.status === 200) return response;
  else if (response.status === 400)
    throw new Error(await response.text());
  else if (response.status === 404)
    throw new Error(await response.text());
  else serverError();
};
