import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/landing.tsx"),


    // Khusus Dashboard
    route("dashboard", "routes/dashboard.jsx", [
        index("routes/dashboard/dashboard.home.jsx"),

        // bank soal
        route("bank-soal", "routes/dashboard/bank-soal/data.bank.jsx"),

        // user
        route("users", "routes/dashboard/users/data.user.jsx"),
        route("users/add", "routes/dashboard/users/add.user.jsx"),
    ]),

] satisfies RouteConfig;
