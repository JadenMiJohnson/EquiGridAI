--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: demo_requests; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'demo@operator.equigrid.ai', '$2b$10$DMttCDj84zjNrfTTTf2Io.WdLDsbnybWO5lDsa7HiXp80liHpHACW', 'Atlanta Data Center', 'operator', '2025-11-07 19:16:08.397616');
INSERT INTO public.users VALUES (2, 'demo@cloud.equigrid.ai', '$2b$10$rJXO1NarQPmzXlNcsBVlrOTy3TF7EIoqlNk8/RO7wP4NBz5ugXsr.', 'FinOptima Cloud', 'cloud', '2025-11-07 19:16:08.584145');
INSERT INTO public.users VALUES (3, 'demo@equigrid.ai', '$2b$10$ESt6u5EjaqxmDAJt/knFheDR7C/D0fscHZBgQ7LqVfHzSuRtde53W', 'Demo Company', 'operator', '2025-11-07 19:22:40.485023');


--
-- Data for Name: integration_configs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.integration_configs VALUES (1, 1, 'LIVE', 'test-key-operator', NULL, '2025-11-07 19:34:13.786933');


--
-- Data for Name: optimization_scenarios; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: report_templates; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: report_versions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.session VALUES ('STjJIxRdULdqDez7ftrGQKrl0LCw43ZJ', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T21:36:42.960Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":2,"email":"demo@cloud.equigrid.ai","companyName":"FinOptima Cloud","role":"cloud"}', '2025-11-14 21:37:20');
INSERT INTO public.session VALUES ('RW1OdjuBuLaFP040AeRs65CBMluixHBE', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T19:18:09.351Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"email":"demo@operator.equigrid.ai","companyName":"Atlanta Data Center","role":"operator"}', '2025-11-14 19:19:18');
INSERT INTO public.session VALUES ('oEg8gsGIREsJSlCmzZUlCMR-J7BWbZst', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T21:23:21.104Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"email":"demo@operator.equigrid.ai","companyName":"Atlanta Data Center","role":"operator"}', '2025-11-14 21:24:51');
INSERT INTO public.session VALUES ('JewTkT_T6iaX3WZYLjivdqgyMEzwe7XS', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T21:34:27.155Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":2,"email":"demo@cloud.equigrid.ai","companyName":"FinOptima Cloud","role":"cloud"}', '2025-11-14 21:35:11');
INSERT INTO public.session VALUES ('qJ3LOK3RzwxUsEixQpFFhm46te9StJ_M', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T21:15:10.500Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":2,"email":"demo@cloud.equigrid.ai","companyName":"FinOptima Cloud","role":"cloud"}', '2025-11-14 21:16:06');
INSERT INTO public.session VALUES ('ofv6qB7gTnuO3mOk0F9dNjDuaz2IhSIZ', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T19:35:22.059Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":2,"email":"demo@cloud.equigrid.ai","companyName":"FinOptima Cloud","role":"cloud"}', '2025-11-14 19:35:31');
INSERT INTO public.session VALUES ('X1jcu1D5ahZGQSFKNRH_2RhM_R5CZ2N_', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T20:50:37.809Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"email":"demo@operator.equigrid.ai","companyName":"Atlanta Data Center","role":"operator"}', '2025-11-14 20:52:28');
INSERT INTO public.session VALUES ('iw-WHshQzy81xj3KiWrPQ96AedpA67tj', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T19:26:07.823Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":2,"email":"demo@cloud.equigrid.ai","companyName":"FinOptima Cloud","role":"cloud"}', '2025-11-14 19:27:23');
INSERT INTO public.session VALUES ('ZqIJBpP0sh-YRJhJtVRL7yccpuiQKZ9I', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T20:46:27.235Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"email":"demo@operator.equigrid.ai","companyName":"Atlanta Data Center","role":"operator"}', '2025-11-14 20:48:15');
INSERT INTO public.session VALUES ('7cVnSw6bO0u6pcV4tkA3kOMq6lxk9rqZ', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-11-14T21:21:08.106Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":2,"email":"demo@cloud.equigrid.ai","companyName":"FinOptima Cloud","role":"cloud"}', '2025-11-15 03:08:43');
INSERT INTO public.session VALUES ('HCmaDZwFCizS33rwVgCBAHkbyTkj2Q-8', '{"cookie":{"originalMaxAge":604799999,"expires":"2025-11-14T20:37:31.737Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"email":"demo@operator.equigrid.ai","companyName":"Atlanta Data Center","role":"operator"}', '2025-11-14 20:38:19');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: demo_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.demo_requests_id_seq', 1, false);


--
-- Name: integration_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.integration_configs_id_seq', 1, true);


--
-- Name: optimization_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.optimization_scenarios_id_seq', 1, false);


--
-- Name: report_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.report_templates_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

