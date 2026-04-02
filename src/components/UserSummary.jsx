function UserSummary({ profile, statistics }) {
  return (
    <div className="user-card">
      <div className="user-left">
        <img
          src={profile.profilePicture || "https://via.placeholder.com/120"}
          alt="profile"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/120";
          }}
        />

        <div>
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p>
            Membre depuis{" "}
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="user-right">
        <p>Distance totale parcourue</p>
        <div className="blue-box">
          {statistics.totalDistance} km
        </div>
      </div>
    </div>
  );
}

export default UserSummary;