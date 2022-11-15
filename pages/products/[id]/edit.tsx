import CustomEditor from "components/Editor";
import styles from "../styles/Home.module.css";

export default function Edit() {
  // 상품 api불러오기

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>즐거운 쇼핑 되세요</h1>
        <CustomEditor />
      </main>
    </div>
  );
}
