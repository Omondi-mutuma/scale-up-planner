"use client"
 
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import FileUploader from "../ui/FileUploader";




 

const  RegisterForm = ({ user }: { user: User }) => {

const router = useRouter();   
const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
        name: "",
        email: "",
        phone: "",
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    //* USING THE USER INFO FROM INPUTS TO CREATE A USER 
    setIsLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument?.length > 0 )

    {
  
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type, 
      });

      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name)
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument:values.identificationDocument ? formData :undefined,
        
      }

      const patient = await registerPatient(patientData);

      if(patient) router.push(`/patient/${user.$id}/new-appointement`)

    } catch (error) {
       console.log(error) 
    }

    setIsLoading(false);
  }

  return (
<Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
    <section className="space-y-4">
        <h1 className="header">You re logged in now</h1>
        <p className="text-dark-700">fill the from bellow bellow with your info</p>
    </section>

    <section className="space-y-6">
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Personal information</h2>
        </div>  
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

    <div className="flex flex-col gap-6 xl:row">
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
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
        />
    <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name="gender"
        label="Gender"
        renderSkeleton={(field) => ( 
          <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:justify-between"
            onValueChange={field.onChange} defaultValue={field.value}>
              {GenderOptions.map((option) => ( 
                <div key={option} className="radio-group">
                  <RadioGroupItem value={option} id={option}/>
                <label htmlFor={option} className="cursor-pointer">
                  {option}
                </label>
                </div>
            ))}
            </RadioGroup>
          </FormControl>
        )}
    />
    </div>


    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="nr Street, City"
      />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="your profession"
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Person s name"
      />
        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(+40) 752 843 555"
        />
    </div>

    <section className="space-y-6">
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Medical information</h2>
        </div>  
    </section>

    <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physiician"
            placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="cursor-pointer flex items-center gap-2">
                <Image 
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
    </CustomFormField>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="nr Street, City"
      />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumver "
            label="Insurance policy number"
            placeholder="IPN000000"
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies "
            label="Allergies (if any)"
            placeholder="Dust, cast, milk"
      />
    <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medication (if any)"
            placeholder="No spa 100mg, Paracetamol 500mg  "
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family meidcal history"
            placeholder=""
      />
    <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder=" "
      />
    </div>

    <section className="space-y-6">
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Identification and Verification</h2>
        </div>  
    </section>

    <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification type"
            placeholder="Select an identification tpye"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
    </CustomFormField>

    <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification number"
            placeholder="1950724356060"
      />

    <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned copy of identifiaction document "
            renderSkeleton={(field) => ( 
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
              </FormControl>
            )}
        />


    <section className="space-y-6">
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Consent and Privacy</h2>
        </div>  
    </section>

    <CustomFormField 
    fieldType={FormFieldType.CHECKBOX} 
    control={form.control}
    name="treatmentConsent"
    label="I consent to treatment"
    />
        <CustomFormField 
    fieldType={FormFieldType.CHECKBOX} 
    control={form.control}
    name="disclosureConsent"
    label="I consent to disclosure of information"
    />
        <CustomFormField 
    fieldType={FormFieldType.CHECKBOX} 
    control={form.control}
    name="privacyConsent"
    label="I consent to privacy policy"
    />

    <div className="flex flex-col gap-6 xl:flex-row">
    
    </div>

    <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
    </form>
</Form> 
    );
};

export default RegisterForm