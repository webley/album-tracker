using System.Collections.Generic;
using System.Linq;
using AlbumTracker.ApiModel.Response;
using AlbumTracker.DomainModel;
using AlbumTracker.DomainModel.Query;

namespace AlbumTracker.WebApi
{
    public static class Extensions
    {
        public static AlbumResponse ToAlbumResponse(this Album album)
        {
            return new AlbumResponse
            {
                Id = album.Id,
                Artist = album.Artist.ToArtistResponse(),
                AlbumArt = album.AlbumArt.ToAlbumArtResponse(),
                Name = album.Name,
                ReleaseDate = album.ReleaseDate,
                TrackList = album.TrackList.ToTrackListResponse()
            };
        }

        public static ArtistResponse ToArtistResponse(this Artist artist)
        {
            return new ArtistResponse
            {
                Id = artist.Id,
                Name = artist.Name,
                Country = artist.Country
            };
        }

        public static AlbumArtResponse ToAlbumArtResponse(this AlbumArt albumArt)
        {
            return new AlbumArtResponse
            {
                Id = albumArt.Id,
                Width = albumArt.Width,
                Height = albumArt.Height
            };
        }

        public static List<TrackResponse> ToTrackListResponse(this List<Track> tracks)
        {
            return tracks.Select(track => new TrackResponse
            {
                Id = track.Id,
                Name = track.Name,
                DurationMs = track.DuationMs
            }).ToList();
        }
    }
}