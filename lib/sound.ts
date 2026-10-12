// Sound effects disabled per user request
class SoundManager {
  public toggleMute(): boolean {
    return true;
  }
  public isMuted(): boolean {
    return true;
  }
  public playTick() {}
  public playClick() {}
  public playShuffle() {}
  public playModalOpen() {}
  public playModalClose() {}
}

export const sound = new SoundManager();
