import { useForm } from "react-hook-form";
import { useState } from "react";
 
 export default function CrosswalkForm() {
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: {} });

    const handleCreate = async(data) => {}

    const onSubmit = (data) => {
        setSubmitting(true)
        handleCreate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Suggest a crosswalk</h1>
            <input {...register("address", { required: true })} />
            <input {...register("latitude", { required: true, min: -90, max: 90 })} />
            <input {...register("longitude", { required: true, min: -180, max: 180 })} />
            <input type="submit" />
        </form>
    )
 }
 