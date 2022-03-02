import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import Formation from "../../interfaces/Formation";
import Role from "../../interfaces/Role";
import User from "../../interfaces/User";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  user?: User;
}

const UserForm: NextPage<Props> = ({ onSubmit, user }) => {
  const t = useTranslations("users");
  const h = useTranslations("home");

  const [roles, setRoles] = useState<Role[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`);
      const data = await response.json();
      setRoles(data);
    };

    const fetchFormations = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formations`);
      const data = await response.json();
      setFormations(data);
    };

    fetchRoles();
    fetchFormations();
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} className="col-md-12 col-lg-10 col-xl-8">
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="user_name">
              <Form.Label>{t("name")}</Form.Label>
              <Form.Control type="text" placeholder={t("name")} defaultValue={user !== undefined ? user.name : ""} required />
            </Form.Group>

            <Form.Group controlId="surname">
              <Form.Label>{t("surname")}</Form.Label>
              <Form.Control type="text" placeholder={t("surname")} defaultValue={user !== undefined ? user.surname : ""} required />
            </Form.Group>

            <Form.Group controlId="r_u_number">
              <Form.Label>r numerke kekw</Form.Label>
              <Form.Control type="text" placeholder="R/U-nummer" defaultValue={user !== undefined ? user.r_u_number : ""} required />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>{t("email")}</Form.Label>
              <Form.Control type="email" placeholder={t("email")} defaultValue={user !== undefined ? user.email : ""} required />
            </Form.Group>
          </Stack>

          <Stack gap={3}>
            <Form.Group controlId="password">
              <Form.Label>{t("password")}</Form.Label>
              <Form.Control type="password" placeholder={t("password")} required />
            </Form.Group>

            <Form.Group controlId="password_check">
              <Form.Label>{t("password_confirmation")}</Form.Label>
              <Form.Control type="password" placeholder={t("password_confirmation")} required />
            </Form.Group>

            <Form.Group controlId="role_id">
              <Form.Label>{t("role")}</Form.Label>
              <Form.Select required>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id} selected={user !== undefined && user.role === role.role}>
                    {role.role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formation_id">
              <Form.Label>{t("formation")}</Form.Label>
              <Form.Select required>
                {formations.map((formation) => (
                  <option key={formation.formation_id} value={formation.formation_id} selected={user !== undefined && user.formation === formation.formation}>
                    {formation.formation}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Stack>
        </div>

        <Button variant="primary" type="submit" className="mt-3">
          {user ? t("profile_edit") : h("register")}
        </Button>
      </Form>
    </>
  );
};

export default UserForm;
