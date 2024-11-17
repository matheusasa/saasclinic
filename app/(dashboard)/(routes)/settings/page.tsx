import { redirect } from "next/navigation";

import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm />
      </div>
    </div>
  );
};

export default SettingsPage;
