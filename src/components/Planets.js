import { useState, useEffect } from "react";
import Planet from "./Planet";

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`https://swapi.dev/api/planets/?page=${page}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Nous n'avons pas pu lire les registres des planètes, status : ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setPlanets((planets) => [...planets, ...data.results]);
        setHasNext(!!data.next); // or setHasNext(data.next ? true : false);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
        setError(error.message);
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
      {hasNext && (
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => {
            setPage(page + 1);
          }}
        >
          Suivantes
        </button>
      )}
      {!hasNext && (
        <p className="bg-dark text-white p-3">
          Nous avons listé toutes les planètes recensées.
        </p>
      )}
    </>
  );
};

export default Planets;
