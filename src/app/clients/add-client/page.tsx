import Head from "next/head";
import ClientForm from "../../components/ClientForm";

export default function CreateClientPage() {
  return (
    <>
      <Head>
        <title>Create Client</title>
      </Head>
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <ClientForm isEditMode={false} />
      </div>
    </>
  );
}
