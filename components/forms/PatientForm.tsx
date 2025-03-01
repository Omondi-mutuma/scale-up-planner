"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>)  {
    setIsLoading(true);

    try {
      const userData = { name, email, phone};

      const user = await createUser(userData);

      if (user) router.push(`/patients/${user.$id}/register`);
        
      
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hello</h1>
            <p className="text-dark-700">here you ll fill in your info to register⤵</p>
        </section>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="your email@gamil.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />
        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(+40) 752 843 555"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <SubmitButton isLoading={isLoading}>Submit </SubmitButton>
      </form>
    </Form> 
    );
};

export default PatientForm