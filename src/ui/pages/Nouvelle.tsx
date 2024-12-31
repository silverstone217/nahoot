import { useState } from "react";
import "../css/nouvelle.css";
import { useStore } from "../lib/store";

const Nouvelle = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status] = useState("pas encore commencée");

  const { token } = useStore();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Veuillez vous connecter pour ajouter une nouvelle competition");
      return;
    }

    if (!name) {
      setError("Le nom de la competition est obligatoire");
      return;
    }

    const formData = {
      name: name.trim().toLowerCase(),
      description: name.trim(),
      status,
    };

    try {
      const response = await fetch(
        `http://${window.location.hostname}:3000/api/competitions/create`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setError("Une erreur est survenue, veuillez réessayer");
        return;
      }

      const data = await response.json();
      console.log("Nouvelle competition créée avec succès:", data);

      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Une erreur est survenue, veuillez réessayer");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="new-main-admin">
      {/* Text */}
      <div>
        <h2>Nouvelle Competitions ou Examen</h2>
        <p>
          Créer une nouvelle competition ou un examen, en remplissant les
          champs-ci dessous, le nom est obligatoire mais la description est
          optionnelle.
        </p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit}>
        {/* name */}
        <div className="input-group">
          <label htmlFor="name">Nom de la compétition*</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="ex: Math 2em semestre 2024"
            minLength={2}
            maxLength={60}
            autoCapitalize="sentences"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>

        {/* description */}
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="ex: Les élèves de Math 2em semestre 2024 devront faire des exercices de français et de maths."
            maxLength={600}
            autoCapitalize="sentences"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>

        {error && <p className="error">{error}</p>}

        {/* submit */}
        <button type="submit" className="btn-submit " disabled={loading}>
          {loading ? "Création en cours..." : "Créer une nouvelle competition"}
        </button>
      </form>
    </div>
  );
};

export default Nouvelle;
