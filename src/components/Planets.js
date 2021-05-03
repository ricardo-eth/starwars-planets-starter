import { useState, useEffect } from "react";
import Planet from "./Planet";

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`https://swapi.dev/api/planets/?page=${page}`, {
      signal: controller.signal,
    })
      // ⚠️ surtout NE PAS OUBLIER d'ENLEVER ⚠️
      .then((response) => {
        return new Promise((resolved) => {
          setTimeout(() => resolved(response), 2000);
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Nous n'avons pas pu lire les registres des planètes, status : ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("I get data");
        console.log(data);
        if (!isCancelled) {
          console.log("I will update component");
          setPlanets((planets) => [...planets, ...data.results]);
          setHasNext(!!data.next); // or setHasNext(data.next ? true : false);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          console.log("I want to cancel");
          console.error(error.message);
          setLoading(false);
          setError(error.message);
          controller.abort();
        }
      });
  }, [page]);

  return (
    <>
      <div className="row">
        {planets.map((planet) => {
          return <Planet key={planet.name} planet={planet} />;
        })}
      </div>
      {loading && <div className="mb-4 text-center p-3">loading...</div>}
      {error && <p className="alert alert-danger">{error}</p>}
      {!loading && hasNext && (
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={loading}
        >
          Suivantes
        </button>
      )}
      {!hasNext && !loading && (
        <p className="bg-dark text-white p-3">
          Nous avons listé toutes les planètes recensées.
        </p>
      )}
    </>
  );
};

export default Planets;
