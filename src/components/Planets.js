import { useState, useEffect } from "react";
import Planet from "./Planet";

const Planets = () => {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    fetch("https://swapi.dev/api/planets/?page=1")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Nous n'avons pas pu lire les registres des planètes, status : ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setPlanets(data.results);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  return (
    <>
      <div className="row">
        {planets.map((planet) => {
          return <Planet key={planet.name} planet={planet} />;
        })}
      </div>
    </>
  );
};

export default Planets;
