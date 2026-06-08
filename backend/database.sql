-- =============================================
-- Base de datos: cendi_jugando
-- Ejecutar en MySQL Workbench o phpMyAdmin
-- =============================================

CREATE DATABASE IF NOT EXISTS cendi_jugando
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cendi_jugando;

-- ── Tabla: usuarios ──
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  correo      VARCHAR(150) NOT NULL UNIQUE,
  contrasena  VARCHAR(255) NOT NULL,
  rol         ENUM('admin','padre') NOT NULL DEFAULT 'padre',
  alumno_id   INT NULL,
  activo      TINYINT(1) DEFAULT 1,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla: grupos ──
CREATE TABLE IF NOT EXISTS grupos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  nivel         VARCHAR(100) NOT NULL,
  creado_en     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla: alumnos ──
CREATE TABLE IF NOT EXISTS alumnos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(150) NOT NULL,
  curp              VARCHAR(18) NULL UNIQUE,
  fecha_nacimiento  DATE NULL,
  nombre_tutor      VARCHAR(150) NOT NULL,
  grupo_id          INT NULL,
  ciclo_escolar     VARCHAR(20) DEFAULT '2025-2026',
  activo            TINYINT(1) DEFAULT 1,
  creado_en         DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE SET NULL
);

-- ── Tabla: pagos ──
CREATE TABLE IF NOT EXISTS pagos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id           INT NOT NULL,
  mes_correspondiente VARCHAR(50) NOT NULL,
  monto               DECIMAL(10,2) NOT NULL,
  concepto            VARCHAR(100) DEFAULT 'Mensualidad',
  fecha_pago          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);

-- ── Tabla: avisos ──
CREATE TABLE IF NOT EXISTS avisos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  titulo            VARCHAR(200) NOT NULL,
  contenido         TEXT NOT NULL,
  publico           TINYINT(1) DEFAULT 0,
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_vigencia    DATE NULL
);

-- ── Actualizar usuarios con alumno_id ──
ALTER TABLE usuarios
  ADD CONSTRAINT fk_usuario_alumno
  FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE SET NULL;

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Grupos
INSERT INTO grupos (nombre, nivel) VALUES
  ('Girasoles',   'Preescolar 1'),
  ('Mariposas',   'Preescolar 2'),
  ('Estrellitas', 'Preescolar 3'),
  ('Arcoiris',    'Maternal');

-- Alumnos
INSERT INTO alumnos (nombre, curp, fecha_nacimiento, nombre_tutor, grupo_id) VALUES
  ('Carlos López García',    'LOGC200101HAGSRL01', '2020-01-15', 'María García',   1),
  ('Sofía Ramírez Torres',   'RATS210305MHGNRF02', '2021-03-05', 'Juan Ramírez',   2),
  ('Emilio Cruz Pérez',      'CUPE190720HAGSML03', '2019-07-20', 'Laura Pérez',    3),
  ('Valentina Díaz López',   'DILV220910MHGNPL04', '2022-09-10', 'Pedro Díaz',     4);

-- Admin (contraseña: admin123)
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
  ('Administrador Cendi', 'admin@cendi.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Padre 1 (contraseña: padre123) — vinculado al alumno 1
INSERT INTO usuarios (nombre, correo, contrasena, rol, alumno_id) VALUES
  ('María García', 'maria@correo.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'padre', 1);

-- Padre 2 (contraseña: padre123) — vinculado al alumno 2
INSERT INTO usuarios (nombre, correo, contrasena, rol, alumno_id) VALUES
  ('Juan Ramírez', 'juan@correo.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'padre', 2);

-- Pagos de prueba
INSERT INTO pagos (alumno_id, mes_correspondiente, monto, concepto) VALUES
  (1, 'Abril 2026',  1500.00, 'Mensualidad'),
  (1, 'Mayo 2026',   1500.00, 'Mensualidad'),
  (2, 'Abril 2026',  1500.00, 'Mensualidad'),
  (2, 'Mayo 2026',   1500.00, 'Mensualidad');

-- Avisos de prueba
INSERT INTO avisos (titulo, contenido, publico, fecha_vigencia) VALUES
  ('Bienvenidos al ciclo 2025-2026', 'Damos la bienvenida a todos los alumnos y familias al nuevo ciclo escolar.', 1, '2026-12-31'),
  ('Festival de fin de cursos',      'El festival será el viernes 20 de junio a las 10:00 a.m. Confirmar asistencia.', 0, '2026-06-20'),
  ('Suspensión de clases',           'No habrá clases el martes 3 de junio por capacitación docente.', 0, '2026-06-03');
