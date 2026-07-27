interface Props {
  size?: "small" | "medium" | "large";
}

function Logo({
  size = "medium",
}: Props) {
  return (
    <div className={`apothika-logo ${size}`}>

      <div className="logo-symbol">

        <div className="logo-core">
          A
        </div>

      </div>

      <div className="logo-text">

        <span>
          APOTHIKA
        </span>

        <small>
          INTELLIGENT BUSINESS OPERATING SYSTEM
        </small>

      </div>

    </div>
  );
}

export default Logo;