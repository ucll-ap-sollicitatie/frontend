import type { GetStaticProps, NextPage } from "next";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { Video } from "../../interfaces/Video";
import { Table } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`http://localhost:3001/videos`);
  const videos = await res.json();

  return {
    props: { videos: videos },
  };
};

interface Props {
  videos: Video[];
}

const Home: NextPage<Props> = ({ videos }) => {
  const { data: session } = useSession();
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <h1>Video's</h1>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Titel</th>
            <th>Datum</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {videos.map(
            (video: Video) =>
              video.email === session.user?.email && (
                <tr key={video.video_id}>
                  <td>{video.video_id}</td>
                  <td>{video.title}</td>
                  <td>{video.date}</td>
                  <td>
                    <Link href={`/videos/${video.video_id}`}>
                      <a className="d-flex align-items-center gap-1">
                        View <BsFillArrowUpRightCircleFill />
                      </a>
                    </Link>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </Layout>
  );
};

export default Home;
