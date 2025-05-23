import { PacienteClient } from "./components/client";

const PacientesPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PacienteClient />
      </div>
    </div>
  );
};

export default PacientesPage;
