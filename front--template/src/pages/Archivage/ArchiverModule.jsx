import { useParams } from "react-router-dom";
import ArchiveRH from "./ArchiveRH";
import ArchiverComptabilite from "./ArchiverComptabilite";
import ArchiverAdministration from "./ArchiverAdministration";

const ArchiverModule = () => {
  const { module } = useParams();

  switch (module) {
    case "Ressources Humaines":
      return <ArchiveRH />;
       case "Comptabilité":
      return <ArchiverComptabilite />;
       case "Administration":
      return <ArchiverAdministration />;
    default:
      return <div>Module inconnu</div>;
  }
};

export default ArchiverModule;
