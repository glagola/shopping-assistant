import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import style from "../../App.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/itemsSlice";

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
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
      pricePerItem: "",
      notes: "",
    },
    resolver: zodResolver(schema),
  });
  const onSubmit = (data) => {
    dispatch(addItem(data));
    navigate("/");
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const navigate = useNavigate();

  return (
    <form className={style.inputList} onSubmit={handleSubmit(onSubmit)}>
      <div>New item</div>
      <label className={style.input}>
        <p className={style.error}>{errors.amount?.message}</p>
        <input
          {...onlyNumbers(register("amount"))}
          type="text"
          placeholder="amount in units"
        />
      </label>
      <label className={style.input}>
        <p className={style.error}>{errors.price?.message}</p>
        <input
          {...onlyNumbers(register("pricePerItem"))}
          type="text"
          placeholder="price per item"
        />
      </label>
      <label className={style.input}>
        <textarea {...register("notes")} placeholder="notes"></textarea>
      </label>

      <button type="submit" className={style.button}>
        add
      </button>
    </form>
  );
};

export default ItemForm;
