import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import style from "../App.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../store/itemsSlice";
import Button from "./Button";

const onlyNumbers = ({ onChange, ...rest }) => {
    const handleChange = (e) => {
        let count = 0;

        e.target.value = e.target.value
            .replace(/[^\d.,]/g, "")
            .replace(",", ".")
            .replace(/[.]/g, () => (count++ === 0 ? "." : ""));

        onChange.call(this, e);
    };

    return { onChange: handleChange, ...rest };
};

const schema = z.object({
    amount: z.string().nonempty("This field is required"),
    pricePerItem: z.string().nonempty("This field is required"),
    notes: z.string().optional(),
});

const ItemForm = () => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            amount: "",
            pricePerItem: "",
            notes: "",
        },
        resolver: zodResolver(schema),
    });

    const { categoryId } = useParams();
    const navigate = useNavigate();

    const onSubmit = (item) => {
        dispatch(addItem({ categoryId, item }));
        navigate(`/category/${categoryId}`, { replace: true });
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-xl">New item</div>
            <label>
                <p className={style.error}>{errors.amount?.message}</p>
                <input
                    className="p-3 border w-full"
                    {...onlyNumbers(register("amount"))}
                    type="text"
                    placeholder="amount in units"
                />
            </label>
            <label>
                <p className={style.error}>{errors.price?.message}</p>
                <input
                    className="p-3 border w-full"
                    {...onlyNumbers(register("pricePerItem"))}
                    type="text"
                    placeholder="price per item"
                />
            </label>
            <label>
                <textarea
                    className="p-3 resize-none border w-full"
                    {...register("notes")}
                    placeholder="notes"
                ></textarea>
            </label>

            <div className={style.buttonContainer}>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/category/${categoryId}`);
                    }}
                >
                    back
                </Button>
                <Button type="submit">add</Button>
            </div>
        </form>
    );
};

export default ItemForm;
