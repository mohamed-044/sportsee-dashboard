function UserCard({ profile }) {
  return (
    <div className="user-card">
      <img src={profile.profilePicture} alt="user" />
      <div>
        <h2>
          {profile.firstName} {profile.lastName}
        </h2>
        <p>
          Membre depuis{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default UserCard;