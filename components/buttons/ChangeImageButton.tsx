import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Button } from "react-bootstrap";

interface Props {
  showUploadModal: (() => void) | undefined;
}

const ChangeImageButton: NextPage<Props> = ({ showUploadModal }) => {
  const t = useTranslations("users");

  return (
    <Button onClick={showUploadModal} variant="primary">
      {t("profile_picture_update")}
    </Button>
  );
};

export default ChangeImageButton;
