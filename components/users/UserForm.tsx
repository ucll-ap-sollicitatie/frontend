import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Stack, Tooltip } from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";
import Formation from "../../interfaces/Formation";
import Role from "../../interfaces/Role";
import User from "../../interfaces/User";

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  activateUser?: () => void;
  user?: User;
}

const UserForm: NextPage<Props> = ({ onSubmit, activateUser, user }) => {
  const t = useTranslations("users");
  const h = useTranslations("home");

  const { data: session } = useSession();
  const current_user = session?.user as User;
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

            {!session && (
              <Form.Group controlId="email">
                <Form.Label>{t("email")}</Form.Label>
                <Form.Control type="email" placeholder={t("email")} defaultValue={user !== undefined ? user.email : ""} required />
              </Form.Group>
            )}
          </Stack>
          <Stack gap={3}>
            {user?.email === current_user?.email && (
              <>
                <Form.Group controlId="password">
                  <Form.Label>{t("password")}</Form.Label>
                  <OverlayTrigger placement="top" overlay={<Tooltip>{t("password_info")}</Tooltip>}>
                    <div className="d-inline-block ms-1">
                      <BsQuestionCircle className="mb-1" />
                    </div>
                  </OverlayTrigger>

                  <Form.Control type="password" placeholder={t("password")} required />
                </Form.Group>

                <Form.Group controlId="password_check">
                  <Form.Label>{t("password_confirmation")}</Form.Label>
                  <Form.Control type="password" placeholder={t("password_confirmation")} required />
                </Form.Group>
              </>
            )}

            {session && (
              <Form.Group controlId="role_id">
                <Form.Label>{t("role")}</Form.Label>
                <Form.Select required disabled={current_user?.role !== "Admin"}>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id} selected={user !== undefined && user.role === role.role}>
                      {role.role}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

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

        <div className="d-flex align-items-center mt-3 gap-2">
          <Button variant="primary" type="submit">
            {user ? t("update_profile_confirm") : h("register")}
          </Button>
          {user != undefined && current_user.role === "Admin" && user.activation_token != null && (
            <Button variant="outline-secondary" onClick={activateUser} type="submit">
              Activate user
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default UserForm;
