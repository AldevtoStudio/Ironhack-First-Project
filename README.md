# Ironhack-First-Project

First Ironhack project, a endless platformer game.

## Description

The game consists in a player jumping on platforms in order to clim over the tower.
The main mechanics are:

- Player movement:
  - Player can move up/down/left/right if is inside windows.
  - The mouse clicks the player avatar (yellow pentagon) on the green dot position, drags down (dark green dot). When the player releases the mouse button, the player will be throw in the oposite direction of the drag (orange line).
    ![alt text](https://i.imgur.com/iqko7gr.png)
- Player can only stay and walk inside windows.
- Player will lose if:
  - Falls below the canvas height.
  - Player cant reach any window, so it falls down by gravity below the canvas height.
  - Enemies hits the player and it falls below the canvas height, but if it finds a window below it can still grab that one and continue playing.
- Endless level, increasing difficulty.
- Score increases every second by one.

## References

![alt text](https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/styles/855/public/media/image/2016/12/234482-mundo-5.jpg)
![alt text](https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/styles/855/public/media/image/2016/12/234486-mundo-5.jpg)

## Page link

- https://aldevto-first-project.netlify.app/
