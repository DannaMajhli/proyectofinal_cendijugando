-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2026 a las 03:09:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cendi_jugando`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `nombre_tutor` varchar(150) NOT NULL,
  `grupo_id` int(11) DEFAULT NULL,
  `ciclo_escolar` varchar(20) DEFAULT '2025-2026',
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id`, `nombre`, `curp`, `fecha_nacimiento`, `nombre_tutor`, `grupo_id`, `ciclo_escolar`, `activo`, `creado_en`) VALUES
(1, 'Emilio Dariel Garcia Torres', NULL, NULL, 'Tutor Garcia Torres', 1, '2025-2026', 1, '2026-06-14 16:23:15'),
(2, 'Fernanda Garcia Estrada', NULL, NULL, 'Tutor Garcia Estrada', 1, '2025-2026', 1, '2026-06-14 16:23:15'),
(3, 'Lucia Gonzalez Aguilar', NULL, NULL, 'Tutor Gonzalez Aguilar', 1, '2025-2026', 1, '2026-06-14 16:23:15'),
(4, 'Mariana Jauregui Arteaga', NULL, NULL, 'Tutor Jauregui Arteaga', 1, '2025-2026', 1, '2026-06-14 16:23:15'),
(5, 'Matias Silvestre Avalos', NULL, NULL, 'Tutor Silvestre Avalos', 1, '2025-2026', 1, '2026-06-14 16:23:15'),
(6, 'Paulina Rios Medina', NULL, NULL, 'Tutor Rios Medina', 2, '2025-2026', 1, '2026-06-14 16:23:15'),
(7, 'Arturo Arce Leandro', NULL, NULL, 'Tutor Arce Leandro', 2, '2025-2026', 1, '2026-06-14 16:23:15'),
(8, 'Danae Perez Torres', NULL, NULL, 'Tutor Perez Torres', 2, '2025-2026', 1, '2026-06-14 16:23:15'),
(9, 'Emma Muñoz Tejada', NULL, NULL, 'Tutor Muñoz Tejada', 2, '2025-2026', 1, '2026-06-14 16:23:15'),
(10, 'Aitana Diaz Lopez', NULL, NULL, 'Tutor Diaz Lopez', 2, '2025-2026', 1, '2026-06-14 16:23:15'),
(11, 'Rafael Aguilar López', NULL, NULL, 'Tutor Aguilar Lopez', 3, '2025-2026', 1, '2026-06-14 16:23:16'),
(12, 'Matias Flores Camarillo', NULL, NULL, 'Tutor Flores Camarillo', 3, '2025-2026', 1, '2026-06-14 16:23:16'),
(13, 'Armando Montoya Adame', NULL, NULL, 'Tutor Montoya Adame', 3, '2025-2026', 1, '2026-06-14 16:23:16'),
(14, 'Jose Vargas Zacarias', NULL, NULL, 'Tutor Vargas Zacarias', 3, '2025-2026', 1, '2026-06-14 16:23:16'),
(15, 'Maximiliano Hernandez Sanchez', NULL, NULL, 'Tutor Hernandez Sanchez', 3, '2025-2026', 1, '2026-06-14 16:23:16'),
(16, 'Abril Campos Gutierrez', NULL, NULL, 'Tutor Campos Gutierrez', 4, '2025-2026', 1, '2026-06-14 16:23:16'),
(17, 'Antonella Aceves Garcia', NULL, NULL, 'Tutor Aceves Garcia', 4, '2025-2026', 1, '2026-06-14 16:23:16'),
(18, 'Mateo Martinez Ruiz', NULL, NULL, 'Tutor Martinez Ruiz', 4, '2025-2026', 1, '2026-06-14 16:23:16'),
(19, 'David Fuentes Gonzalez', NULL, NULL, 'Tutor Fuentes Gonzalez', 4, '2025-2026', 1, '2026-06-14 16:23:16'),
(20, 'Pablo Santiago Tabor Zuñiga', NULL, NULL, 'Tutor Tabor Zuñiga', 4, '2025-2026', 1, '2026-06-14 16:23:16'),
(21, 'Ricardo Villalobos Padilla', NULL, NULL, 'Tutor Villalobos Padilla', 5, '2025-2026', 1, '2026-06-14 16:23:16'),
(22, 'Ivan Hernandez Aguilar', NULL, NULL, 'Tutor Hernandez Aguilar', 5, '2025-2026', 1, '2026-06-14 16:23:16'),
(23, 'Amber Zacarias Loera', NULL, NULL, 'Tutor Zacarias Loera', 5, '2025-2026', 1, '2026-06-14 16:23:16'),
(24, 'Kailani Nieto Lopez', NULL, NULL, 'Tutor Nieto Lopez', 5, '2025-2026', 1, '2026-06-14 16:23:16'),
(25, 'Ana Luisa Aceves Campos', NULL, NULL, 'Tutor Aceves Campos', 6, '2025-2026', 1, '2026-06-14 16:23:16'),
(26, 'Erick Daniel Martinez Romo', NULL, NULL, 'Tutor Martinez Romo', 6, '2025-2026', 1, '2026-06-14 16:23:16'),
(27, 'Maximiliano Vivos Ramirez', NULL, NULL, 'Tutor Vivos Ramirez', 6, '2025-2026', 1, '2026-06-14 16:23:16'),
(28, 'Caleb Galvan Avila', NULL, NULL, 'Tutor Galvan Avila', 6, '2025-2026', 1, '2026-06-14 16:23:16'),
(29, 'Ivan Silva Sanchez', NULL, NULL, 'Tutor Silva Sanchez', 6, '2025-2026', 1, '2026-06-14 16:23:16'),
(30, 'Tadeo Arriaga Macias', NULL, NULL, 'Tutor Arriaga Macias', 7, '2025-2026', 1, '2026-06-14 16:23:16'),
(31, 'Carlos Luka Medina', NULL, NULL, 'Tutor Luka Medina', 7, '2025-2026', 1, '2026-06-14 16:23:16'),
(32, 'Alberto Castañeda Alvaro', NULL, NULL, 'Tutor Castañeda Alvaro', 7, '2025-2026', 1, '2026-06-14 16:23:16'),
(33, 'Jose Luis Pérez Ortis', NULL, NULL, 'Tutor Perez Ortis', 7, '2025-2026', 1, '2026-06-14 16:23:16'),
(34, 'Sofia Flores Luna', NULL, NULL, 'Tutor Flores Luna', 7, '2025-2026', 1, '2026-06-14 16:23:16'),
(35, 'Lucia Celine Medina Flores', NULL, NULL, 'Tutor Medina Flores', 8, '2025-2026', 1, '2026-06-14 16:23:16'),
(36, 'Isabel Macias Morales', NULL, NULL, 'Tutor Macias Morales', 8, '2025-2026', 1, '2026-06-14 16:23:16'),
(37, 'Fatima Noriega Aguilera', NULL, NULL, 'Tutor Noriega Aguilera', 8, '2025-2026', 1, '2026-06-14 16:23:16'),
(38, 'Marco Gabriel Ibarra Soto', NULL, NULL, 'Tutor Ibarra Soto', 8, '2025-2026', 1, '2026-06-14 16:23:16'),
(39, 'Ruben Vazquez Torres', NULL, NULL, 'Tutor Vazquez Torres', 8, '2025-2026', 1, '2026-06-14 16:23:16'),
(40, 'Diego Andre Ayala Montes', NULL, NULL, 'Tutor Ayala Montes', 9, '2025-2026', 1, '2026-06-14 16:23:16'),
(41, 'Jazmin Acosta Lopez', NULL, NULL, 'Tutor Acosta Lopez', 9, '2025-2026', 1, '2026-06-14 16:23:16'),
(42, 'Ana Paula Briones Ponce', NULL, NULL, 'Tutor Briones Ponce', 9, '2025-2026', 1, '2026-06-14 16:23:16'),
(43, 'Luciana Guadalupe Castañeda Diaz', NULL, NULL, 'Tutor Castañeda Diaz', 9, '2025-2026', 1, '2026-06-14 16:23:16'),
(44, 'Natalia Romo Alife', NULL, NULL, 'Tutor Romo Alife', 9, '2025-2026', 1, '2026-06-14 16:23:16'),
(45, 'Alessa Araiza Ortega', NULL, NULL, 'Tutor Araiza Ortega', 10, '2025-2026', 1, '2026-06-14 16:23:16'),
(46, 'Gabriel Cortez Navarro', NULL, NULL, 'Tutor Cortez Navarro', 10, '2025-2026', 1, '2026-06-14 16:23:16'),
(47, 'Abraham Altamirano Cruz', NULL, NULL, 'Tutor Altamirano Cruz', 10, '2025-2026', 1, '2026-06-14 16:23:16'),
(48, 'Gabriela Hernandez Lira', NULL, NULL, 'Tutor Hernandez Lira', 10, '2025-2026', 1, '2026-06-14 16:23:16'),
(49, 'Zoe Muñoz Pérez', NULL, NULL, 'Tutor Muñoz Perez', 10, '2025-2026', 1, '2026-06-14 16:23:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avisos`
--

CREATE TABLE `avisos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `contenido` text NOT NULL,
  `publico` tinyint(1) DEFAULT 0,
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `fecha_vigencia` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `avisos`
--

INSERT INTO `avisos` (`id`, `titulo`, `contenido`, `publico`, `fecha_publicacion`, `fecha_vigencia`) VALUES
(1, 'Bienvenidos al ciclo 2025-2026', 'El equipo de Cendi Jugando les da la más cordial bienvenida a todos los alumnos y familias al nuevo ciclo escolar. ¡Juntos haremos un año increíble!', 1, '2026-06-14 16:23:16', '2026-12-31'),
(2, 'Festival de fin de cursos', 'Los invitamos al festival de fin de cursos que se llevará a cabo el viernes 20 de junio a las 10:00 a.m. en las instalaciones del kinder. Por favor confirmar asistencia.', 0, '2026-06-14 16:23:16', '2026-06-20'),
(3, 'Suspensión de clases — 3 de junio', 'Se les informa que el martes 3 de junio no habrá clases debido a capacitación docente. El regreso a actividades es el miércoles 4 de junio con horario normal.', 0, '2026-06-14 16:23:16', '2026-06-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE `grupos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `nivel` varchar(100) NOT NULL,
  `creado_en` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupos`
--

INSERT INTO `grupos` (`id`, `nombre`, `nivel`, `creado_en`) VALUES
(1, 'Lactantes', 'Lactantes', '2026-06-14 16:23:15'),
(2, 'Maternal A', 'Maternal', '2026-06-14 16:23:15'),
(3, 'Maternal B1', 'Maternal', '2026-06-14 16:23:15'),
(4, 'Maternal B2', 'Maternal', '2026-06-14 16:23:15'),
(5, 'Preescolar 1°A', 'Preescolar 1', '2026-06-14 16:23:15'),
(6, 'Preescolar 1°B', 'Preescolar 1', '2026-06-14 16:23:15'),
(7, 'Preescolar 2°A', 'Preescolar 2', '2026-06-14 16:23:15'),
(8, 'Preescolar 2°B', 'Preescolar 2', '2026-06-14 16:23:15'),
(9, 'Preescolar 3°A', 'Preescolar 3', '2026-06-14 16:23:15'),
(10, 'Preescolar 3°B', 'Preescolar 3', '2026-06-14 16:23:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `alumno_id` int(11) NOT NULL,
  `mes_correspondiente` varchar(50) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `concepto` varchar(100) DEFAULT 'Mensualidad',
  `fecha_pago` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `alumno_id`, `mes_correspondiente`, `monto`, `concepto`, `fecha_pago`) VALUES
(1, 1, 'Abril 2026', 1500.00, 'Mensualidad', '2026-06-14 16:23:16'),
(2, 1, 'Mayo 2026', 1500.00, 'Mensualidad', '2026-06-14 16:23:16'),
(3, 6, 'Abril 2026', 1500.00, 'Mensualidad', '2026-06-14 16:23:16'),
(4, 6, 'Mayo 2026', 1500.00, 'Mensualidad', '2026-06-14 16:23:16'),
(5, 11, 'Abril 2026', 1500.00, 'Mensualidad', '2026-06-14 16:23:16'),
(6, 16, 'Mayo 2026', 1500.00, 'Mensualidad', '2026-06-14 16:23:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('admin','padre') NOT NULL DEFAULT 'padre',
  `alumno_id` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `rol`, `alumno_id`, `activo`, `creado_en`) VALUES
(1, 'Administrador Cendi', 'admin@cendi.com', '$2b$10$jq.DftbJHHQD8mlfCJliQeBjjjSjE0lG8hsBAH1fgI6Qq9ZB13LqK', 'admin', NULL, 1, '2026-06-14 16:23:16'),
(2, 'Tutor Garcia Torres', 'garcia.torres@correo.com', '$2b$10$4Nc7bcS4CeNVDcbZOOfhZ.2swV7YMANbjy5FSii82t18QhKddRGsq', 'padre', 1, 1, '2026-06-14 16:23:16'),
(3, 'Tutor Rios Medina', 'rios.medina@correo.com', '$2b$10$4Nc7bcS4CeNVDcbZOOfhZ.2swV7YMANbjy5FSii82t18QhKddRGsq', 'padre', 6, 1, '2026-06-14 16:23:16');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `curp` (`curp`),
  ADD KEY `grupo_id` (`grupo_id`);

--
-- Indices de la tabla `avisos`
--
ALTER TABLE `avisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumno_id` (`alumno_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuario_alumno` (`alumno_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `avisos`
--
ALTER TABLE `avisos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `grupos`
--
ALTER TABLE `grupos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_alumno` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
