import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
import { CompetitionType } from "../types/admin";
import "../css/competitions.css";
import { Ellipsis } from "lucide-react";

const Competitions = () => {
  const [competData, setCompetData] = useState<CompetitionType[]>([]);
  const [loading, setLoading] = useState(false);

  // const [file, setFile] = useState<File | null>(null); // Typage pour le fichier
  // const [images, setImages] = useState<string[]>([]);
  // const navigate = useNavigate();

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = event.target.files?.[0]; // Récupérer le fichier sélectionné
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //   }
  // };

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://${window.location.hostname}:3000/api/images`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setImages(data);
  //     } catch (error) {
  //       console.error("Error fetching images:", error);
  //     }
  //   };

  //   fetchImages();
  // }, []);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!file) {
  //     console.error("No file selected");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("image", file); // Ajouter le fichier à FormData

  //   try {
  //     const response = await fetch(
  //       `http://${window.location.hostname}:3000/api/images`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     console.log("Image uploaded successfully:", data);
  //     setFile(null); // Reset le fichier après l'upload
  //     navigate("/admin/competitions");
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `http://${window.location.hostname}:3000/api/competitions/list`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCompetData(data.competitions);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="admin-compet">
      <div className="admin-compet-top">
        <h2 className="admin-compet-top-h2">Les competitions ou examens</h2>
        <p className="admin-compet-top-p">
          Voici la liste des compétitions ou examens actuels.
          <br /> Filtrer ou lancer une.
        </p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Status</th>
              <th>Crée le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {competData.length > 0 &&
              competData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                  <td>
                    {new Date(item.created_at).toLocaleString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <button onClick={() => console.log(item)} title="Actions">
                      <Ellipsis />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && <div>chargement...</div>}{" "}
        {/* Affichage d'un message de chargement */}
        {competData.length === 0 && !loading && (
          <div>Aucune compétition actuelle</div>
        )}
      </div>
    </div>
  );
};

export default Competitions;
