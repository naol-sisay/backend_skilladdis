-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: skilladdis
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificates` (
  `certificate_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `course_id` varchar(36) NOT NULL,
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`certificate_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES ('d829db35-85f4-4ad5-a79f-0ed3eb9baacf','86b3238f-a3c3-44fb-ab99-de41cc5886db','3dbfa003-3d29-4720-a68a-140301edea74','2026-06-06 15:11:08');
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_contents`
--

DROP TABLE IF EXISTS `course_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_contents` (
  `content_id` varchar(36) NOT NULL,
  `course_id` varchar(36) NOT NULL,
  `title` varchar(150) NOT NULL,
  `content_type` enum('video','note','quiz') NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `note_text` text DEFAULT NULL,
  `order_index` int(11) NOT NULL,
  PRIMARY KEY (`content_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_contents_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_contents`
--

LOCK TABLES `course_contents` WRITE;
/*!40000 ALTER TABLE `course_contents` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_materials`
--

DROP TABLE IF EXISTS `course_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_materials` (
  `material_id` varchar(36) NOT NULL,
  `section_id` varchar(36) NOT NULL,
  `material_type` enum('video','note') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `sequence_order` int(11) NOT NULL,
  PRIMARY KEY (`material_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `course_materials_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`section_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_materials`
--

LOCK TABLES `course_materials` WRITE;
/*!40000 ALTER TABLE `course_materials` DISABLE KEYS */;
INSERT INTO `course_materials` VALUES ('062eb816-0aa5-48b2-9e6d-32ca6258025f','8a4d6506-ef47-49bc-aecd-eaf072d998fd','note','Mastering Lines & Shapes','\"Required Materials: A pad of cheap newsprint paper for gesture/warmups, a high-quality smooth sketchbook (A4 or 9x12 inch, 100gsm+), graphite pencils ranging from 2H (hard/light) to 4B and 6B (soft/dark), a standard vinyl white eraser, and a moldable kneaded eraser .When sketching, never lock your wrist. Lock your wrist only for high-detail work. For smooth, sweeping, straight lines or large curves, use the overhand grip. This shifts the pivot point from your wrist or knuckles to your elbow and shoulder, giving you a massive range of steady fluid action. Exercise 1: Draw 20 dots randomly across a page, then attempt to connect them cleanly using rapid single-pass strokes. Do not trace or hesitate mid-stroke; instead, \'ghost\' the trajectory in the air 2-3 times before making direct contact with the paper.',1),('203e8800-4522-448e-9163-90a056e8f3dc','8a4d6506-ef47-49bc-aecd-eaf072d998fd','video','Constructive Drawing','https://youtu.be/01dLvv9RPVQ?si=VCYWLcGnHirkqycm',4),('392df741-2fcb-444e-8a0f-b1612bb308e5','8a4d6506-ef47-49bc-aecd-eaf072d998fd','video','Introduction ','https://youtu.be/ewMksAbgdBI?si=9IkBHmP41JPLaMbx',0),('40338672-fae9-4880-90be-85ad5d9f9a93','8a4d6506-ef47-49bc-aecd-eaf072d998fd','note','Value and Shading','Every complex organic structure can be broken down into simple foundational masses: the cube, the sphere, the cylinder, and the cone. When attempting to sketch an object (e.g., a mug, a human arm, or a house), ignore all superficial textures and surface details. First, capture its geometric scaffolding. For example, a coffee mug is simply a cylinder with an elongated torus (donut shape) attached to its profile. Ensure your ellipses are symmetrical and wrap properly around the central axis of the cylinder to maintain physical depth.',3),('5633c1cd-ab26-4f8f-8fa1-ef6dbcedbd2d','8a4d6506-ef47-49bc-aecd-eaf072d998fd','video','Understanding Perspective','https://youtu.be/5Zc1xVS_X7Q?si=E39PflQQiy8jPgad',2),('7241ac1a-e0bc-4ccb-bb61-2c2f0e9c1716','8a4d6506-ef47-49bc-aecd-eaf072d998fd','note','The Five Essential Zones of Form Shading','Linear perspective is a mathematical framework used to simulate 3D space on a flat 2D plane. The Horizon Line directly matches the literal eye-level of the viewer. In One-Point perspective, all horizontal and vertical front-facing planes remain parallel to the borders of the page, while all parallel lines receding directly away from the viewer (orthogonal lines) converge perfectly onto a single point on the horizon line called the Vanishing Point. If an object is drawn above the horizon line, you will see its bottom surface; if below, you will see its top surface.',5),('e7eac931-68de-48f4-abd2-358dcc6a49ff','8a4d6506-ef47-49bc-aecd-eaf072d998fd','video','final course','https://youtu.be/jF0JPyxQ_3Y?si=iCDFy3tjaTr22vAL',7),('e9bfc105-7bdb-46da-b3c9-6e39cf988cfe','8a4d6506-ef47-49bc-aecd-eaf072d998fd','note','The Five Essential Zones of Form Shading 2','To render a convincing 3D shape, you must understand the exact zoning of light behavior. 1. Highlight: The bright point where light hits the surface directly at a 90-degree angle. 2. Midtone / Halftone: The true local color of the object, transitioning smoothly as the surface begins to curve away from the light source. 3. Core Shadow: The darkest band on the form itself where the surface completely turns away from the light source, separating the light side from the shadow side. 4. Reflected Light: Secondary ambient light bounced back onto the shadow side from surrounding surfaces (never make this as bright as a halftone). 5. Cast Shadow: The dark silhouette thrown onto an adjacent surface, which features a sharp edge near the object (occlusion zone) and diffuses as it moves outward',6);
/*!40000 ALTER TABLE `course_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_sections`
--

DROP TABLE IF EXISTS `course_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_sections` (
  `section_id` varchar(36) NOT NULL,
  `course_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `sequence_order` int(11) NOT NULL,
  PRIMARY KEY (`section_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_sections`
--

LOCK TABLES `course_sections` WRITE;
/*!40000 ALTER TABLE `course_sections` DISABLE KEYS */;
INSERT INTO `course_sections` VALUES ('8a4d6506-ef47-49bc-aecd-eaf072d998fd','3dbfa003-3d29-4720-a68a-140301edea74','Introduction & Materials',0);
/*!40000 ALTER TABLE `course_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `course_id` varchar(36) NOT NULL,
  `instructor_id` varchar(36) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `price_etb` decimal(10,2) NOT NULL,
  `status` enum('pending_approval','approved','rejected','archived') DEFAULT 'pending_approval',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` varchar(36) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `title` (`title`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('3dbfa003-3d29-4720-a68a-140301edea74','86b3238f-a3c3-44fb-ab99-de41cc5886db','How to Draw: Fundamentals for Beginners','Learn the core fundamentals of drawing, from understanding your materials to mastering perspective, shading, and basic proportions. Perfect for absolute beginners.\nRequires basic sketching pencils (HB, 2B, 4B), an eraser, and sketch paper.\n    ','programming','https://img.youtube.com/vi/1jjmOF1hQqI/maxresdefault.jpg',0.00,'approved','2026-06-06 12:33:31',NULL,NULL,'https://youtu.be/1jjmOF1hQqI?si=qLcJfm4fJhCc3GGF','Beginner',''),('c80287d5-72a3-41d4-92fb-13755633ebcc','86b3238f-a3c3-44fb-ab99-de41cc5886db','hjvsefv','fgd','programming','https://img.youtube.com/vi/tk3uZaiHI_c/maxresdefault.jpg',0.00,'approved','2026-06-13 11:22:36',NULL,NULL,'https://youtu.be/tk3uZaiHI_c?si=yPvW1-fLCCFtIY9-','','');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enrollments` (
  `enrollment_id` varchar(36) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  `course_id` varchar(36) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed','dropped') DEFAULT 'active',
  `payment_status` enum('pending','paid','free') DEFAULT 'pending',
  PRIMARY KEY (`enrollment_id`),
  KEY `student_id` (`student_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_questions`
--

DROP TABLE IF EXISTS `exam_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exam_questions` (
  `question_id` varchar(36) NOT NULL,
  `exam_id` varchar(36) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_option` enum('A','B','C','D') NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `exam_questions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_questions`
--

LOCK TABLES `exam_questions` WRITE;
/*!40000 ALTER TABLE `exam_questions` DISABLE KEYS */;
INSERT INTO `exam_questions` VALUES ('q-26eed0ff','exam-34a95716','What unique advantage does a moldable \'Kneaded Eraser\' offer over standard vinyl block erasers?','It can be shaped precisely to pull out clean highlights without tearing paper fibers','It can cleanly remove deep permanent ink or colored marker pigment lines','It automatically sharpens the tip of a charcoal or graphite pencil during contact','It darkens midtones to blend them into core shadows seamlessly','A'),('q-42492c8e','exam-34a95716','Which physical pivot point should be used when drawing long, sweeping lines or layout sketches?','The fingers and thumb using a tight tripod grip','-The wrist using side-to-side motions','The elbow and shoulder using an overhand grip','The knuckles using vertical snapping motions','C'),('q-5021399e','exam-34a95716','Where do all parallel receding lines (orthogonals) meet in a perspective system?','At the focal highlight point','At the outer edge of the occlusion shadow','At the Vanishing Point on the horizon line','\"At the center point of the viewer\'s physical drawing paper','C'),('q-55f4a4eb','exam-34a95716','What visual distortion occurs to an object\'s flat face as it rotates away from the viewer in space?','It changes color due to the angle of light interaction','It foreshortens, causing its depth to appear compressed along the line of sight','It grows continuously larger to indicate an increase in mass','It aligns perfectly parallel with the vertical borders of the sketchbook','B'),('q-5f58339d','exam-34a95716','Which graphite pencil grade is ideal for laying down initial, very faint, lightweight structural guidelines?','6B','4B','2H','HB','C'),('q-9138b511','exam-34a95716','Why should the \'Reflected Light\' zone on an object never be rendered completely white?','Because it is an illusion and does not actually exist in nature','Because it resides completely within the shadow side and must remain darker than any lit surface','Because it will cause the graphite paper surface to smudge and tear easily','Because it should always match the exact value of the core shadow band','B'),('q-9e576255','exam-34a95716','When deconstructing complex real-world objects into simple forms, what should a student look for first?','Surface textures, micro-scratches, and high-contrast highlights','Basic geometric 3D primitives like spheres, cubes, and cylinders','The exact color pigments required to match the object\'s hue','The type of shadow pattern cast across the background surfaces','B'),('q-ddea6bd6','exam-34a95716','What is the band of maximum shadow situated directly on the object itself where light can no longer reach?','The Cast Shadow','The Core Shadow','The Ambient Occlusion','The Halftone Gradient','B'),('q-f6e5e66d','exam-34a95716','What is the primary purpose of the \'ghosting\' technique in line work?','To erase unwanted dark guidelines','To rehearse a fluid stroke trajectory in the air before committing to the paper','To rehearse a fluid stroke trajectory in the air before committing to the paper',' trace over a reference photograph using transparent tracing paper','B'),('q-f97e8fa8','exam-34a95716','In linear perspective drawing, what does the \'Horizon Line\' accurately represent?','The physical boundary line where mountains meet the sky','The exact height and eye-level of the viewer\'s camera or gaze','The baseline threshold where cast shadows hit the earth','The dividing edge between the core shadow and the ambient reflected light','B');
/*!40000 ALTER TABLE `exam_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exams` (
  `exam_id` varchar(36) NOT NULL,
  `course_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `minimum_pass_score` int(11) DEFAULT 70,
  PRIMARY KEY (`exam_id`),
  UNIQUE KEY `course_id` (`course_id`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES ('exam-34a95716','3dbfa003-3d29-4720-a68a-140301edea74','',70),('exam-f18a706a','c80287d5-72a3-41d4-92fb-13755633ebcc','',70);
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `progress` (
  `progress_id` varchar(36) NOT NULL,
  `enrollment_id` varchar(36) NOT NULL,
  `content_id` varchar(36) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `last_accessed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`progress_id`),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `content_id` (`content_id`),
  CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE,
  CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `course_contents` (`content_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
/*!40000 ALTER TABLE `progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` varchar(36) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','instructor','admin') NOT NULL,
  `is_approved_instructor` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT 'uploads/default.png',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('43b3b669-ac90-4f84-8d8e-1114dd3ef1fc','Abebe Kebede','abebe@example.com','$2b$10$pTHT2vxxNHoXtY4.F1BFMO..3fGMHB49UoXLXVcRM4aRo8sxCVROa','student',0,'2026-06-01 13:43:40',NULL,'uploads/default.png'),('86b3238f-a3c3-44fb-ab99-de41cc5886db','naol sisay','noladrake553@gmail.com','$2b$10$STyQGCr5S6agALPHLTeY0.3Fjiowk7fE/TG4phXiTlgwG5dsIbPka','instructor',0,'2026-06-02 10:09:26',NULL,'uploads/default.png'),('b84f05ec-98d7-44aa-927f-95046f2475f0','naol sisay','noladrake550@gmail.com','$2b$10$.xGij5pAFvjtyHBbh9N7AepGKxawMKyXzCatzzrEpFnQUHWotmkyy','student',0,'2026-06-01 15:13:20',NULL,'uploads/default.png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-13 18:54:20
