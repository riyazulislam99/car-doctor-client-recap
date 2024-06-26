import { useEffect, useState } from "react";
import TableRow from "./TableRow";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Booking = () => {
  const { user } = useAuth();
  const [bookings, setBooking] = useState([]);
  const axiosSecure = useAxiosSecure();

  const url = `/bookings?email=${user.email}`;
  // const url = `http://localhost:5000/bookings?email=${user.email}`;

  useEffect(() => {
    axiosSecure.get(url).then((data) => {
      setBooking(data.data);
    });

    // fetch(url, { credentials: "include" })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setBooking(data);
    //   });
  }, [url, axiosSecure]);

  const handelDelete = (id) => {
    const proceed = confirm("Are you sure");
    if (proceed) {
      fetch(`http://localhost:5000/bookings/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            alert("Deleted successfully");
            const remaining = bookings.filter((booking) => booking._id !== id);
            setBooking(remaining);
          }
        });
    }
  };

  const handleBookingConfirm = (id) => {
    fetch(`http://localhost:5000/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "confirm" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          // updated state
          const remaining = bookings.filter((booking) => booking._id !== id);
          const updated = bookings.find((booking) => booking._id !== id);
          updated.status = "confirm";
          const newBookings = [updated, ...remaining];
          setBooking(newBookings);
        }
      });
  };

  return (
    <div>
      <h2>My Booking: {bookings.length}</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <TableRow
                key={booking._id}
                booking={booking}
                handelDelete={handelDelete}
                handleBookingConfirm={handleBookingConfirm}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
