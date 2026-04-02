function ProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <h3>Votre profil</h3>
      <p>Âge : {profile.age}</p>
      <p>Taille : {profile.height} cm</p>
      <p>Poids : {profile.weight} kg</p>
    </div>
  );
}

export default ProfileCard;