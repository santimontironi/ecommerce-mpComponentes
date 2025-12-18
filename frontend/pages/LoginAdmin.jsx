import { useContext } from "react"
import { ContextAdmin } from "../context/adminContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";

export const LoginAdmin = () => {

  const { admin, loadingLogin, loginAdmin } = useContext(ContextAdmin);

  const { handleSubmit, register } = useForm();

  const navigate = useNavigate()

  async function submitForm(data) {
    try {
      await loginAdmin(data)
    } catch (error) {
      console.log("Error al iniciar sesión", error);
    }
  }

  return (
    <section>
      {loadingLogin ? <Loader /> : (
        <div>
          <form method="post" onSubmit={handleSubmit(submitForm)}></form>
        </div>
      )}
    </section>
  )
}
