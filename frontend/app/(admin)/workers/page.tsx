import PageTitle from "@/components/molecules/PageTitle";
import ListWorkersTable from "@/components/organisms/ListWorkersTable";

const WorkerPage = () => {
    return (
        <main className="flex flex-col gap-5">
            <PageTitle title="Workers" description="View and manage worker information, wearable device data, and live monitoring insights." />
            <ListWorkersTable/>
        </main>
    )
}

export default WorkerPage;