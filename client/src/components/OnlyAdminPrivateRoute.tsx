import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { Outlet, Navigate } from "react-router-dom"

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user)

  return currentUser?.isAdmin ? <Outlet /> : <Navigate to='/sign-in' />
}

export default OnlyAdminPrivateRoute
