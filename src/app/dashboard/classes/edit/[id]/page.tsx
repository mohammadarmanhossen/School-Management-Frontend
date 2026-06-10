"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ClassForm, classToFormData } from "@/components/dashboard/class-form";
import { useClass, useClassMutations, useTeachersForSelect } from "@/hooks/use-classes-data";
import type { ClassFormData } from "@/schemas";
import { notFound } from "next/navigation";

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data: classData, isLoading: isClassLoading } = useClass(id);
  const { update } = useClassMutations();
  const { data: teachers = [] } = useTeachersForSelect();

  if (isClassLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!classData) {
    notFound();
  }

  const onSubmit = async (data: ClassFormData) => {
    await update.mutateAsync({ id, data });
    router.push("/dashboard/classes");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Class"
        description={`Update information for ${classData.name}`}
        breadcrumbs={[
          { label: "Classes", href: "/dashboard/classes" },
          { label: "Edit" },
        ]}
      />

      <ClassForm
        teachers={teachers}
        defaultValues={classToFormData(classData)}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        submitLabel="Save Changes"
        isLoading={update.isPending}
      />
    </div>
  );
}
