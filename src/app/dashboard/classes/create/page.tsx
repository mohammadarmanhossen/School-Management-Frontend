"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ClassForm } from "@/components/dashboard/class-form";
import { useClassMutations, useTeachersForSelect } from "@/hooks/use-classes-data";
import type { ClassFormData } from "@/schemas";

export default function CreateClassPage() {
  const router = useRouter();
  const { create } = useClassMutations();
  const { data: teachers = [] } = useTeachersForSelect();

  const onSubmit = async (data: ClassFormData) => {
    await create.mutateAsync(data);
    router.push("/dashboard/classes");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Class"
        description="Add a new class for the academic year"
        breadcrumbs={[
          { label: "Classes", href: "/dashboard/classes" },
          { label: "Create" },
        ]}
      />

      <ClassForm
        teachers={teachers}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        submitLabel="Create Class"
        isLoading={create.isPending}
      />
    </div>
  );
}
