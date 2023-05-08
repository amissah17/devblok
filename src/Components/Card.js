import Image from "next/image";
import style from "@/styles/Card.module.css";
import Link from "next/link";

function PostCard({ title, content, slug }) {
  return (
    <div className={style.postContainer}>
      <div>
        <div className={style.postImage}>
          <Image
            src={content.Featured_Image.filename}
            alt={content.Featured_Image.alt}
            fill
            className={style.imgs}
          />
        </div>
        <Link href={`blog/${slug}`}>
          <h2 className={style.postTitle}>{title}</h2>
        </Link>
      </div>

      {/* post author info */}
      <div className={style.postAuthorInfo}>
        <div className={style.avatar}>
          <Image
            src={content.Author.content.Cover_Photo.filename}
            alt="article image"
            fill
            className={style.avatarRad}
          />
        </div>
        <div>
          <h3>{content.Author.name}</h3>
          <div className={style.postInfo}>
            <p>April 26,2023</p>
          </div>
        </div>
      </div>
      {/* end of post author info */}
    </div>
  );
}

export default PostCard;
